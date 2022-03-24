import { ESLint } from 'eslint'
import translateOptions from './engineOptions'

/* eslint-disable import/prefer-default-export */
export const lint = async (options, files) => {
  const engine = new ESLint(translateOptions(options))

  const results = await engine.lintFiles(files)

  if (options.fix) {
    await ESLint.outputFixes(results)
  }

  return results
}
