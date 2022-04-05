"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _promises = _interopRequireDefault(require("fs/promises"));

var _lodash = require("lodash");

var FilesFinder = /*#__PURE__*/function () {
  function FilesFinder(workerOptions) {
    var _workerOptions$folder, _workerOptions$ignore;

    (0, _classCallCheck2["default"])(this, FilesFinder);
    this.numberOfWorkers = workerOptions.workers;
    this.folders = (_workerOptions$folder = workerOptions === null || workerOptions === void 0 ? void 0 : workerOptions.folders) !== null && _workerOptions$folder !== void 0 ? _workerOptions$folder : ['.'];
    this.ignoredFolders = (_workerOptions$ignore = workerOptions === null || workerOptions === void 0 ? void 0 : workerOptions.ignoredFolders) !== null && _workerOptions$ignore !== void 0 ? _workerOptions$ignore : [];
    this.fileTypesRegex = this.createFileTypesRegex(workerOptions === null || workerOptions === void 0 ? void 0 : workerOptions.fileTypes);
    this.ignoredFilesRegex = this.createIgnoredFilesRegex(workerOptions === null || workerOptions === void 0 ? void 0 : workerOptions.ignoredFiles);
  }

  (0, _createClass2["default"])(FilesFinder, [{
    key: "createFileTypesRegex",
    value: function createFileTypesRegex(fileTypes) {
      if (!fileTypes) return null;
      return RegExp("(".concat(fileTypes.map(function (fileType) {
        return fileType.includes('.') ? "".concat(fileType, "$") : ".".concat(fileType, "$");
      }).join('|'), ")"), 'i');
    }
  }, {
    key: "createIgnoredFilesRegex",
    value: function createIgnoredFilesRegex(ignoredFiles) {
      if (!ignoredFiles) return null;
      return RegExp("(".concat(ignoredFiles.map(function (ignoredFile) {
        return "".concat(ignoredFile, "$");
      }).join('|'), ")"), 'i');
    }
  }, {
    key: "recursiveFindFiles",
    value: function () {
      var _recursiveFindFiles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(folder) {
        var _this = this;

        var rootFolder;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _promises["default"].readdir(folder, {
                  withFileTypes: true
                });

              case 2:
                rootFolder = _context2.sent;
                return _context2.abrupt("return", Promise.all(rootFolder.filter(function (fileOrFolder) {
                  return _this.isAccepted(fileOrFolder);
                }).map( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fileOrFolder) {
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            return _context.abrupt("return", fileOrFolder.isDirectory() ? _this.recursiveFindFiles(_path["default"].resolve(folder, fileOrFolder.name)) : _this.getRelativePath(folder, fileOrFolder.name));

                          case 1:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref.apply(this, arguments);
                  };
                }())));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function recursiveFindFiles(_x) {
        return _recursiveFindFiles.apply(this, arguments);
      }

      return recursiveFindFiles;
    }()
  }, {
    key: "isAccepted",
    value: function isAccepted(fileOrFolder) {
      var _this$fileTypesRegex$, _this$fileTypesRegex;

      if (fileOrFolder.isDirectory()) {
        return !this.ignoredFolders.includes(fileOrFolder.name);
      }

      if (this.ignoredFilesRegex) {
        var isIgnoredFile = this.ignoredFilesRegex.test(fileOrFolder.name);

        if (isIgnoredFile) {
          return false;
        }
      }

      return (_this$fileTypesRegex$ = (_this$fileTypesRegex = this.fileTypesRegex) === null || _this$fileTypesRegex === void 0 ? void 0 : _this$fileTypesRegex.test(fileOrFolder.name)) !== null && _this$fileTypesRegex$ !== void 0 ? _this$fileTypesRegex$ : true;
    }
  }, {
    key: "getRelativePath",
    value: function getRelativePath(folder, file) {
      return _path["default"].relative(process.cwd(), _path["default"].resolve(folder, file));
    }
  }, {
    key: "findFilesWithNumberOfWorkers",
    value: function () {
      var _findFilesWithNumberOfWorkers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var _this2 = this;

        var files;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return Promise.all(this.folders.map( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(folder) {
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            return _context3.abrupt("return", _this2.recursiveFindFiles(_path["default"].resolve(process.cwd(), folder)));

                          case 1:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 2:
                files = _context4.sent;
                return _context4.abrupt("return", this.splitFilesAmongWorkers((0, _lodash.flattenDeep)(files)));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function findFilesWithNumberOfWorkers() {
        return _findFilesWithNumberOfWorkers.apply(this, arguments);
      }

      return findFilesWithNumberOfWorkers;
    }()
  }, {
    key: "splitFilesAmongWorkers",
    value: function splitFilesAmongWorkers(files) {
      var numberPerChunk = Math.ceil(files.length / this.numberOfWorkers);
      return files.reduce(function (acc, file, idx) {
        var chunkIndex = Math.floor(idx / numberPerChunk);

        if (!acc[chunkIndex]) {
          acc[chunkIndex] = [];
        }

        acc[chunkIndex] = [].concat((0, _toConsumableArray2["default"])(acc[chunkIndex]), [file]);
        return acc;
      }, []);
    }
  }]);
  return FilesFinder;
}();

exports["default"] = FilesFinder;