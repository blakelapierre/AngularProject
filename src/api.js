import ohm from 'ohm-js';

import toAngularProject from './transformers/toAngularProject';

import ap_grammar from './grammar/AngularProject.ohm.js';
import ap_toObject from './grammar/AngularProject.toObject.semantics';

import GrammarError from './GrammarError';

const {grammar, semantics} = loadGrammarWithSemantics();

const api = (text, directory) => new Promise((resolve, reject) => {
  try { resolve(toAngularProject(process(text), directory)); }
  catch (e) { reject(e); }
});

export {api};

function process(text) {
  const match = grammar.match(text);

  if (match.succeeded()) return semantics(match).toObject();
  else throw new GrammarError(match);
}

function loadGrammarWithSemantics() {
  const name = 'AngularProject',
        grammar = ohm.grammars(ap_grammar)[name],
        semantics = grammar.semantics();

  semantics.addOperation('toObject', ap_toObject);

  return {grammar, semantics};
}