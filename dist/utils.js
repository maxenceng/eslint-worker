"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omitUnused = exports.getEslintOptions = exports.getCliOptions = exports.findConfig = exports.buildOptionsFromArgs = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _lodash = require("lodash");

var _os = _interopRequireDefault(require("os"));

var _eslintOptions = _interopRequireDefault(require("./eslintOptions"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var CONFIG_FILE_NAME = '.eslintworkerrc';

var NUM_CPUS = _os["default"].cpus().length;

var resolveFile = function resolveFile() {
  return _path["default"].resolve(process.cwd(), CONFIG_FILE_NAME);
};

var parseConfig = function parseConfig(file) {
  return JSON.parse(file);
}; // Omit values in args that are of no use here


var omitUnused = function omitUnused(argv) {
  return (0, _lodash.omit)(argv, ['$0']);
};

exports.omitUnused = omitUnused;

var findConfig = function findConfig() {
  var file = resolveFile();

  if (_fs["default"].existsSync(file)) {
    return parseConfig(_fs["default"].readFileSync(file));
  }

  return {};
};

exports.findConfig = findConfig;

var buildOptionsFromArgs = function buildOptionsFromArgs(argv) {
  var options = _objectSpread({}, omitUnused(argv));

  if (argv.fix) {
    options.fix = true;
  }

  if (argv.debug) {
    options.debug = true;
  } // NB: Passing --quiet as a number for compatibility with yargs


  options.quiet = argv.quiet ? 1 : 0;
  return options;
};

exports.buildOptionsFromArgs = buildOptionsFromArgs;

var getEslintOptions = function getEslintOptions(argv) {
  return _eslintOptions["default"].parse(omitUnused(argv));
};

exports.getEslintOptions = getEslintOptions;

var getCliOptions = function getCliOptions(argv) {
  var config = findConfig();
  var argsOptions = buildOptionsFromArgs(argv);
  return _objectSpread(_objectSpread({
    workers: NUM_CPUS
  }, config), argsOptions);
};

exports.getCliOptions = getCliOptions;