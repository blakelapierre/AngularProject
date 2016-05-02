import {loadGrammarWithSemantics, run, runFromFile} from './ohmLoader';

import {toAngularProject} from './transformers/toAngularProject';

const {grammar, semantics} = loadGrammarWithSemantics('AngularProject', ['toObject']);

export function runOn(model, directory = '.') {
  return toAngularProject(run(model, grammar, semantics, 'toObject'));
}

export function runOnFile(file, directory = '.') {
  return toAngularProject(runFromFile(file, grammar, semantics, 'toObject'));
}
