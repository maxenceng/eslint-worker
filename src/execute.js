import { Worker } from 'jest-worker'
import path from 'path'
import { ESLint } from 'eslint'
import { flattenDeep } from 'lodash'
import FilesFinder from './filesFinder'
import translateOptions from './engineOptions'
import { getCliOptions, getEslintOptions } from './utils'

/* eslint-disable no-console */
const countErrors = (results) => results.reduce((acc, result) => ({
  errorCount: acc.errorCount + result.errorCount,
  fatalErrorCount: acc.fatalErrorCount + result.fatalErrorCount,
  warningCount: acc.warningCount + result.warningCount,
}), { errorCount: 0, fatalErrorCount: 0, warningCount: 0 })

const handleErrors = (results, options) => {
  const { errorCount, fatalErrorCount, warningCount } = countErrors(results)
  const tooManyWarnings = options.maxWarnings >= 0 && warningCount > options.maxWarnings
  const shouldExitForFatalErrors = options.exitOnFatalError && fatalErrorCount > 0

  if (!errorCount && tooManyWarnings) {
    console.error(
      'ESLint found too many warnings (maximum: %s).',
      options.maxWarnings,
    )
  }

  if (shouldExitForFatalErrors) {
    return 2
  }

  return (errorCount || tooManyWarnings) ? 1 : 0
}

export default async (argv) => {
  const workerOptions = getCliOptions(argv)
  const eslintOptions = getEslintOptions(argv)
  const engine = new ESLint(translateOptions(eslintOptions))

  if (eslintOptions.help) {
    console.log(eslintOptions.generateHelp())
    return 0
  }

  if (eslintOptions.printConfig) {
    const fileConfig = await engine.calculateConfigForFile(eslintOptions.printConfig)

    console.info(JSON.stringify(fileConfig, null, '  '))
    return 0
  }

  if (eslintOptions.fix) {
    console.debug('Fix mode enabled - applying fixes')
  }

  const formatter = await engine.loadFormatter(eslintOptions.format)
  const filesFinder = new FilesFinder(workerOptions)
  const filesForEachWorker = await filesFinder.findFilesWithNumberOfWorkers()
  const worker = new Worker(path.join(__dirname, './lintWorker'), {
    enableWorkerThreads: workerOptions.enableThreads ?? true,
    numWorkers: workerOptions.workers,
  })

  try {
    const results = await Promise.all(
      filesForEachWorker.map((filesForWorker) => worker.lint(eslintOptions, filesForWorker)),
    )
    const flatResults = flattenDeep(results)

    let resultsToPrint = flatResults
    if (eslintOptions.quiet) {
      console.debug('Quiet mode enabled - filtering out warnings')
      resultsToPrint = ESLint.getErrorResults(flatResults)
    }
    const formattedResults = formatter.format(resultsToPrint)
    console.log(formattedResults)
    return handleErrors(flatResults, eslintOptions)
  } catch (e) {
    console.error(e)
    return 2
  }
}
