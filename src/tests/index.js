require('../traceur-runtime');

import util from 'util';

import _ from 'lodash';

import {loadGrammarWithSemantics, runFromFile} from '../ohmLoader';

import {toAngularProject} from '../transformers/toAngularProject';

const {grammar, semantics} = loadGrammarWithSemantics('AngularProject', ['toObject']);

const object = runFromFile('./tests/samples/2016-fantasy', grammar, semantics, 'toObject');

log(util.inspect(object, false, null));

// log(toPostgreSQL(orderTables(model)).join('\n'));

toAngularProject(object);

function log(...args) {
  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg) {
      case 'object': return util.inspect(arg, {showHidden: true, depth: null});
      default: return arg;
    }
  }
}