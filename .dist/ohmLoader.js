'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGrammarWithSemantics = loadGrammarWithSemantics;
exports.run = run;
exports.runFromFile = runFromFile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ohmJs = require('ohm-js');

var _ohmJs2 = _interopRequireDefault(_ohmJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadGrammarWithSemantics(grammarName, semanticNames = [], fileName = `./grammar/${ grammarName }.ohm`) {
  const grammar = _ohmJs2.default.grammars(_fs2.default.readFileSync(fileName))[grammarName],
        semantics = grammar.semantics();

  semanticNames.forEach(addSemanticName);

  return { grammar, semantics };

  function addSemanticName(name) {
    const s = require(`./grammar/${ grammarName }.${ name }.semantics`).default;
    semantics.addOperation(name, s);
  }
}

function run(model, grammar, semantics, operation) {
  const match = grammar.match(model);
  if (match.succeeded()) {
    const result = semantics(match).toObject();
    return result;
  } else {
    console.error(match.message);
  }
}

function runFromFile(modelFile, grammar, semantics, operation) {
  return run(_fs2.default.readFileSync(modelFile).toString(), grammar, semantics, operation);
}
//# sourceMappingURL=ohmLoader.js.map
