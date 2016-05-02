import {loadGrammarWithSemantics, runFromFile} from './ohmLoader';

import {toAngularProject} from './transformers/toAngularProject';

const {grammar, semantics} = loadGrammarWithSemantics('AngularProject', ['toObject']);

const file = process.argv[2];

if (file) {
  const object = runFromFile(file, grammar, semantics, 'toObject');

  toAngularProject(object);
}
else console.log('No file!');