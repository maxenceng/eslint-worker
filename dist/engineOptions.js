"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var quietFixPredicate = function quietFixPredicate(message) {
  return message.severity === 2;
};
/**
 * Translates the CLI options into the options expected by the CLIEngine.
 * @param {ParsedCLIOptions} cliOptions The CLI options to translate.
 * @returns {ESLintOptions} The options object for the CLIEngine.
 * @private
 */


module.exports = function (_ref) {
  var cache = _ref.cache,
      cacheFile = _ref.cacheFile,
      cacheLocation = _ref.cacheLocation,
      cacheStrategy = _ref.cacheStrategy,
      config = _ref.config,
      env = _ref.env,
      errorOnUnmatchedPattern = _ref.errorOnUnmatchedPattern,
      eslintrc = _ref.eslintrc,
      ext = _ref.ext,
      fix = _ref.fix,
      fixDryRun = _ref.fixDryRun,
      fixType = _ref.fixType,
      global = _ref.global,
      ignore = _ref.ignore,
      ignorePath = _ref.ignorePath,
      ignorePattern = _ref.ignorePattern,
      inlineConfig = _ref.inlineConfig,
      parser = _ref.parser,
      parserOptions = _ref.parserOptions,
      plugin = _ref.plugin,
      quiet = _ref.quiet,
      reportUnusedDisableDirectives = _ref.reportUnusedDisableDirectives,
      resolvePluginsRelativeTo = _ref.resolvePluginsRelativeTo,
      rule = _ref.rule,
      rulesdir = _ref.rulesdir;
  return {
    allowInlineConfig: inlineConfig,
    cache: cache,
    cacheLocation: cacheLocation || cacheFile,
    cacheStrategy: cacheStrategy,
    errorOnUnmatchedPattern: errorOnUnmatchedPattern,
    extensions: ext,
    fix: (fix || fixDryRun) && (quiet ? quietFixPredicate : true),
    fixTypes: fixType,
    ignore: ignore,
    ignorePath: ignorePath,
    overrideConfig: {
      env: env && env.reduce(function (obj, name) {
        return _objectSpread(_objectSpread({}, obj), {}, (0, _defineProperty2["default"])({}, name, true));
      }, {}),
      globals: global && global.reduce(function (obj, name) {
        if (name.endsWith(':true')) {
          return _objectSpread(_objectSpread({}, obj), {}, (0, _defineProperty2["default"])({}, name.slice(0, -5), 'writable'));
        }

        return _objectSpread(_objectSpread({}, obj), {}, (0, _defineProperty2["default"])({}, name, 'readonly'));
      }, {}),
      ignorePatterns: ignorePattern,
      parser: parser,
      parserOptions: parserOptions,
      plugins: plugin,
      rules: rule
    },
    overrideConfigFile: config,
    reportUnusedDisableDirectives: reportUnusedDisableDirectives ? 'error' : undefined,
    resolvePluginsRelativeTo: resolvePluginsRelativeTo,
    rulePaths: rulesdir,
    useEslintrc: eslintrc
  };
};