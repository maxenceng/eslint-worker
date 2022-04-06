const quietFixPredicate = (message) => message.severity === 2

/**
 * Translates the CLI options into the options expected by the CLIEngine.
 * @param {ParsedCLIOptions} cliOptions The CLI options to translate.
 * @returns {ESLintOptions} The options object for the CLIEngine.
 * @private
 */
module.exports = ({
  cache,
  cacheFile,
  cacheLocation,
  cacheStrategy,
  config,
  env,
  errorOnUnmatchedPattern,
  eslintrc,
  ext,
  fix,
  fixDryRun,
  fixType,
  global,
  ignore,
  ignorePath,
  ignorePattern,
  inlineConfig,
  parser,
  parserOptions,
  plugin,
  quiet,
  reportUnusedDisableDirectives,
  resolvePluginsRelativeTo,
  rule,
  rulesdir,
}) => ({
  allowInlineConfig: inlineConfig,
  cache,
  cacheLocation: cacheLocation || cacheFile,
  cacheStrategy,
  errorOnUnmatchedPattern,
  extensions: ext,
  fix: (fix || fixDryRun) && (quiet ? quietFixPredicate : true),
  fixTypes: fixType,
  ignore,
  ignorePath,
  overrideConfig: {
    env: env && env.reduce((obj, name) => ({
      ...obj,
      [name]: true,
    }), {}),
    globals: global && global.reduce((obj, name) => {
      if (name.endsWith(':true')) {
        return {
          ...obj,
          [name.slice(0, -5)]: 'writable',
        }
      }
      return {
        ...obj,
        [name]: 'readonly',
      }
    }, {}),
    ignorePatterns: ignorePattern,
    parser,
    parserOptions,
    plugins: plugin,
    rules: rule,
  },
  overrideConfigFile: config,
  reportUnusedDisableDirectives: reportUnusedDisableDirectives ? 'error' : undefined,
  resolvePluginsRelativeTo,
  rulePaths: rulesdir,
  useEslintrc: eslintrc,
})
