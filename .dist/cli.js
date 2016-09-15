#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _api = require('./api');

var _GrammarError = require('./GrammarError');

var _GrammarError2 = _interopRequireDefault(_GrammarError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i = 2;
if (process.argv[0].endsWith('AngularProject')) i = 1;

var fileName = process.argv[i],
    directory = process.argv[i + 1];

processProjectFile(fileName);

function processProjectFile(fileName, directory) {
  (0, _api.api)(_fs2.default.readFileSync(fileName).toString(), directory).catch(function (e) {
    if (e instanceof _GrammarError2.default) console.error(e.match.message);else console.error(e);
  });
}