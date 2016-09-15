'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _api = require('../api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _api.api)(_fs2.default.readFileSync('./tests/samples/2016-fantasy').toString()).then(log).then(function () {
  return console.log('w');
}).catch(function (e) {
  return console.error(e);
});

function log() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
      case 'object':
        return _util2.default.inspect(arg, { showHidden: true, depth: null });
      default:
        return arg;
    }
  }
}