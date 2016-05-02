'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _2 = require('./../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const object = (0, _2.runOnFile)('./tests/samples/2016-fantasy');

// import {loadGrammarWithSemantics, runFromFile} from '../ohmLoader';

// import {toAngularProject} from '../transformers/toAngularProject';

// const {grammar, semantics} = loadGrammarWithSemantics('AngularProject', ['toObject']);

// const object = runFromFile('./tests/samples/2016-fantasy', grammar, semantics, 'toObject');

log(_util2.default.inspect(object, false, null));

// log(toPostgreSQL(orderTables(model)).join('\n'));

// toAngularProject(object);

function log(...args) {
  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg) {
      case 'object':
        return _util2.default.inspect(arg, { showHidden: true, depth: null });
      default:
        return arg;
    }
  }
}
//# sourceMappingURL=index.js.map
