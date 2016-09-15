'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runOn = runOn;
exports.runOnFile = runOnFile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ohmLoader = require('./ohmLoader');

var _toAngularProject = require('./transformers/toAngularProject');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var grammarName = 'AngularProject';

var _loadGrammarFromFileW = (0, _ohmLoader.loadGrammarFromFileWithSemantics)(grammarName, ['toObject']);

var grammar = _loadGrammarFromFileW.grammar;
var semantics = _loadGrammarFromFileW.semantics;
function runOn(model) {
  var directory = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];

  return (0, _toAngularProject.toAngularProject)((0, _ohmLoader.run)(model, grammar, semantics, 'toObject'));
}

function runOnFile(file) {
  var directory = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];

  return (0, _toAngularProject.toAngularProject)((0, _ohmLoader.runFromFile)(file, grammar, semantics, 'toObject'));
}