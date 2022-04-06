"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('eslint'),
    ESLint = _require.ESLint;

var translateOptions = require('./engineOptions');

var lint = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(options, files) {
    var engine, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            engine = new ESLint(translateOptions(options));
            _context.next = 3;
            return engine.lintFiles(files);

          case 3:
            results = _context.sent;

            if (!options.fix) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return ESLint.outputFixes(results);

          case 7:
            return _context.abrupt("return", results);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function lint(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  lint: lint
};