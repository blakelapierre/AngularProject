#!/usr/bin/env node

import fs from 'fs';

import {api} from './api';

import GrammarError from './GrammarError';

let i = 2;
if (process.argv[0].endsWith('AngularProject')) i = 1;

const fileName = process.argv[i],
      directory = process.argv[i+1];

processProjectFile(fileName);

function processProjectFile(fileName, directory) {
  api(fs.readFileSync(fileName).toString(), directory)
    .catch(e => {
      if (e instanceof GrammarError) console.error(e.match.message);
      else console.error(e);
    });
}