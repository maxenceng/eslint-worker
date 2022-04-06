import path from 'path'
import fs from 'fs'
import { omit } from 'lodash'
import os from 'os'
import eslintOptions from './eslintOptions'

const CONFIG_FILE_NAME = '.eslintworkerrc'
const NUM_CPUS = os.cpus().length

const resolveFile = () => path.resolve(process.cwd(), CONFIG_FILE_NAME)

const parseConfig = (file) => JSON.parse(file)

// Omit values in args that are of no use here
export const omitUnused = (argv) => omit(argv, ['$0'])

export const omitUnusedByESLint = (argv) => omit(argv, ['$0', 'verbose'])

export const findConfig = () => {
  const file = resolveFile()
  if (fs.existsSync(file)) {
    return parseConfig(fs.readFileSync(file))
  }
  return {}
}

export const buildOptionsFromArgs = (argv) => {
  const options = { ...omitUnused(argv) }
  if (argv.fix) {
    options.fix = true
  }
  if (argv.debug) {
    options.debug = true
  }
  // NB: Passing --quiet as a number for compatibility with yargs
  options.quiet = argv.quiet ? 1 : 0

  return options
}

export const getEslintOptions = (argv) => eslintOptions.parse(omitUnusedByESLint(argv))

export const getCliOptions = (argv) => {
  const config = findConfig()
  const argsOptions = buildOptionsFromArgs(argv)
  return {
    workers: NUM_CPUS,
    ...config,
    ...argsOptions,
  }
}
