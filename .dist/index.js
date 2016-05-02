'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runOn = runOn;
exports.runOnFile = runOnFile;

var _ohmLoader = require('./ohmLoader');

var _toAngularProject = require('./transformers/toAngularProject');

const { grammar, semantics } = (0, _ohmLoader.loadGrammarWithSemantics)('AngularProject', ['toObject']);

function runOn(model, directory = '.') {
  return (0, _toAngularProject.toAngularProject)((0, _ohmLoader.run)(model, grammar, semantics, 'toObject'));
}

function runOnFile(file, directory = '.') {
  return (0, _toAngularProject.toAngularProject)((0, _ohmLoader.runFromFile)(file, grammar, semantics, 'toObject'));
}
//# sourceMappingURL=index.js.map
