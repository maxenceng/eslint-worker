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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(argv) {
    var _workerOptions$enable;

    var workerOptions, eslintOptions, engine, fileConfig, formatter, filesFinder, filesForEachWorker, worker, _workerOptions$verbos, isVerboseMode, results, flatResults, resultsToPrint, formattedResults;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            workerOptions = (0, _utils.getCliOptions)(argv);
            eslintOptions = (0, _utils.getEslintOptions)(argv);
            engine = new _eslint.ESLint((0, _engineOptions["default"])(eslintOptions));

            if (!eslintOptions.help) {
              _context2.next = 6;
              break;
            }

            console.log(eslintOptions.generateHelp());
            return _context2.abrupt("return", 0);

          case 6:
            if (!eslintOptions.printConfig) {
              _context2.next = 12;
              break;
            }

            _context2.next = 9;
            return engine.calculateConfigForFile(eslintOptions.printConfig);

          case 9:
            fileConfig = _context2.sent;
            console.info(JSON.stringify(fileConfig, null, '  '));
            return _context2.abrupt("return", 0);

          case 12:
            if (eslintOptions.fix) {
              console.debug('Fix mode enabled - applying fixes');
            }

            _context2.next = 15;
            return engine.loadFormatter(eslintOptions.format);

          case 15:
            formatter = _context2.sent;
            filesFinder = new _filesFinder["default"](workerOptions);
            _context2.next = 19;
            return filesFinder.findFilesWithNumberOfWorkers();

          case 19:
            filesForEachWorker = _context2.sent;
            worker = new _jestWorker.Worker(_path["default"].join(__dirname, './lintWorker'), {
              enableWorkerThreads: (_workerOptions$enable = workerOptions.enableThreads) !== null && _workerOptions$enable !== void 0 ? _workerOptions$enable : true,
              numWorkers: workerOptions.workers
            });
            _context2.prev = 21;
            isVerboseMode = (_workerOptions$verbos = workerOptions === null || workerOptions === void 0 ? void 0 : workerOptions.verbose) !== null && _workerOptions$verbos !== void 0 ? _workerOptions$verbos : false;
            _context2.next = 25;
            return Promise.all(filesForEachWorker.map( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(filesForWorker, idx) {
                var resultForCurrentWorker;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (isVerboseMode) {
                          console.debug("worker ".concat(idx, " is linting listed files : "), filesForWorker);
                        }

                        _context.next = 3;
                        return worker.lint(eslintOptions, filesForWorker);

                      case 3:
                        resultForCurrentWorker = _context.sent;

                        if (isVerboseMode && resultForCurrentWorker) {
                          console.debug("worker ".concat(idx, " finished linting"));
                        }

                        return _context.abrupt("return", resultForCurrentWorker);

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 25:
            results = _context2.sent;
            flatResults = (0, _lodash.flattenDeep)(results);
            resultsToPrint = flatResults;

            if (eslintOptions.quiet) {
              console.debug('Quiet mode enabled - filtering out warnings');
              resultsToPrint = _eslint.ESLint.getErrorResults(flatResults);
            }

            formattedResults = formatter.format(resultsToPrint);
            console.log(formattedResults);
            return _context2.abrupt("return", handleErrors(flatResults, eslintOptions));

          case 34:
            _context2.prev = 34;
            _context2.t0 = _context2["catch"](21);
            console.error(_context2.t0);
            return _context2.abrupt("return", 2);

          case 38:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[21, 34]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;