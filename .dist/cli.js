'use strict';

var _ohmLoader = require('./ohmLoader');

var _toAngularProject = require('./transformers/toAngularProject');

const { grammar, semantics } = (0, _ohmLoader.loadGrammarWithSemantics)('AngularProject', ['toObject']);

const file = process.argv[2];

if (file) {
  const object = (0, _ohmLoader.runFromFile)(file, grammar, semantics, 'toObject');

  (0, _toAngularProject.toAngularProject)(object);
} else console.log('No file!');
//# sourceMappingURL=cli.js.map
