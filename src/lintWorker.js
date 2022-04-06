const { ESLint } = require('eslint')
const translateOptions = require('./engineOptions')

const lint = async (options, files) => {
  const engine = new ESLint(translateOptions(options))

  const results = await engine.lintFiles(files)

  if (options.fix) {
    await ESLint.outputFixes(results)
  }

  return results
}

module.exports = { lint }
