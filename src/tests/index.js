import fs from 'fs';
import util from 'util';

import {api} from '../api';


api(fs.readFileSync('./tests/samples/2016-fantasy').toString())
  .then(log)
  .then(() => console.log('w'))
  .catch(e => console.error(e));

function log(...args) {
  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg) {
      case 'object': return util.inspect(arg, {showHidden: true, depth: null});
      default: return arg;
    }
  }
}
