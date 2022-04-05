"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jestWorker = require("jest-worker");

var _path = _interopRequireDefault(require("path"));

var _eslint = require("eslint");

var _lodash = require("lodash");

var _filesFinder = _interopRequireDefault(require("./filesFinder"));

var _engineOptions = _interopRequireDefault(require("./engineOptions"));

var _utils = require("./utils");

/* eslint-disable no-console */
var countErrors = function countErrors(results) {
  return results.reduce(function (acc, result) {
    return {
      errorCount: acc.errorCount + result.errorCount,
      fatalErrorCount: acc.fatalErrorCount + result.fatalErrorCount,
      warningCount: acc.warningCount + result.warningCount
    };
  }, {
    errorCount: 0,
    fatalErrorCount: 0,
    warningCount: 0
  });
};

var handleErrors = function handleErrors(results, options) {
  var _countErrors = countErrors(results),
      errorCount = _countErrors.errorCount,
      fatalErrorCount = _countErrors.fatalErrorCount,
      warningCount = _countErrors.warningCount;

  var tooManyWarnings = options.maxWarnings >= 0 && warningCount > options.maxWarnings;
  var shouldExitForFatalErrors = options.exitOnFatalError && fatalErrorCount > 0;

  if (!errorCount && tooManyWarnings) {
    console.error('ESLint found too many warnings (maximum: %s).', options.maxWarnings);
  }

  if (shouldExitForFatalErrors) {
    return 2;
  }

  return errorCount || tooManyWarnings ? 1 : 0;
};

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(argv) {
    var workerOptions, eslintOptions, engine, fileConfig, formatter, filesFinder, filesForEachWorker, worker, results, flatResults, resultsToPrint, formattedResults;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            workerOptions = (0, _utils.getCliOptions)(argv);
            eslintOptions = (0, _utils.getEslintOptions)(argv);
            engine = new _eslint.ESLint((0, _engineOptions["default"])(eslintOptions));

            if (!eslintOptions.help) {
              _context.next = 6;
              break;
            }

            console.log(eslintOptions.generateHelp());
            return _context.abrupt("return", 0);

          case 6:
            if (!eslintOptions.printConfig) {
              _context.next = 12;
              break;
            }

            _context.next = 9;
            return engine.calculateConfigForFile(eslintOptions.printConfig);

          case 9:
            fileConfig = _context.sent;
            console.info(JSON.stringify(fileConfig, null, '  '));
            return _context.abrupt("return", 0);

          case 12:
            if (eslintOptions.fix) {
              console.debug('Fix mode enabled - applying fixes');
            }

            _context.next = 15;
            return engine.loadFormatter(eslintOptions.format);

          case 15:
            formatter = _context.sent;
            filesFinder = new _filesFinder["default"](workerOptions);
            _context.next = 19;
            return filesFinder.findFilesWithNumberOfWorkers();

          case 19:
            filesForEachWorker = _context.sent;
            worker = new _jestWorker.Worker(_path["default"].join(__dirname, './lintWorker'), {
              numWorkers: workerOptions.workers
            });
            _context.prev = 21;
            _context.next = 24;
            return Promise.all(filesForEachWorker.map(function (filesForWorker) {
              return worker.lint(eslintOptions, filesForWorker);
            }));

          case 24:
            results = _context.sent;
            flatResults = (0, _lodash.flattenDeep)(results);
            resultsToPrint = flatResults;

            if (eslintOptions.quiet) {
              console.debug('Quiet mode enabled - filtering out warnings');
              resultsToPrint = _eslint.ESLint.getErrorResults(flatResults);
            }

            formattedResults = formatter.format(resultsToPrint);
            console.log(formattedResults);
            return _context.abrupt("return", handleErrors(flatResults, eslintOptions));

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](21);
            console.error(_context.t0);
            return _context.abrupt("return", 2);

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[21, 33]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;