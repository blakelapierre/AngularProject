'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _ohmJs = require('ohm-js');

var _ohmJs2 = _interopRequireDefault(_ohmJs);

var _toAngularProject = require('./transformers/toAngularProject');

var _toAngularProject2 = _interopRequireDefault(_toAngularProject);

var _AngularProjectOhm = require('./grammar/AngularProject.ohm.js');

var _AngularProjectOhm2 = _interopRequireDefault(_AngularProjectOhm);

var _AngularProjectToObject = require('./grammar/AngularProject.toObject.semantics');

var _AngularProjectToObject2 = _interopRequireDefault(_AngularProjectToObject);

var _GrammarError = require('./GrammarError');

var _GrammarError2 = _interopRequireDefault(_GrammarError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _loadGrammarWithSeman = loadGrammarWithSemantics();

var grammar = _loadGrammarWithSeman.grammar;
var semantics = _loadGrammarWithSeman.semantics;


var api = function api(text, directory) {
  return new Promise(function (resolve, reject) {
    try {
      resolve((0, _toAngularProject2.default)(process(text), directory));
    } catch (e) {
      reject(e);
    }
  });
};

exports.api = api;


function process(text) {
  var match = grammar.match(text);

  if (match.succeeded()) return semantics(match).toObject();else throw new _GrammarError2.default(match);
}

function loadGrammarWithSemantics() {
  var name = 'AngularProject',
      grammar = _ohmJs2.default.grammars(_AngularProjectOhm2.default)[name],
      semantics = grammar.semantics();

  semantics.addOperation('toObject', _AngularProjectToObject2.default);

  return { grammar: grammar, semantics: semantics };
}