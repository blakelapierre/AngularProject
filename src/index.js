require('traceur-runtime');

import {loadGrammarWithSemantics, runFromFile} from './ohmLoader';

import {toAngularProject} from './transformers/toAngularProject';

const {grammar, semantics} = loadGrammarWithSemantics('AngularProject', ['toObject']);

const object = runFromFile(`${process.argv[2]}`, grammar, semantics, 'toObject');

toAngularProject(object);