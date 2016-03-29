'use strict';

var argv = require('argv');
var moment = require('moment');
var fs = require('fs-extra');
var glob = require('glob');
var appRootPath = require('app-root-path').path + '/';

var packageJson = require(appRootPath + 'package.json');
var baseDir = packageJson.posts || 'posts/';

var args = argv.option([{
  name: 'date',
  short: 'd',
  type: 'string',
  description: 'create date(YYYY-MM-DD or YYYY/MM/DD), default=today',
  example: "'--date=2016-09-24' or '-d 2016/09/24'"
}, {
  name: 'key',
  short: 'k',
  type: 'string',
  description: 'create title(my-birth-day), default=ordinary-day',
  example: "'--key=my-birth-day' or '-k my-birth-day'"
}, {
  name: 'title',
  short: 't',
  type: 'string',
  description: 'create key(私の誕生日), default=こんにちわ',
  example: "'--title=私の誕生日' or '-t 私の誕生日'"
}]).run().options;

var date = args.date && args.date.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/) ? moment(args.date) : moment();
var key = args.key || 'ordinary-day';
var title = args.title || 'こんにちわ';
var template = function (date, title) {
  return ('\n---\ndate: ' + date + '\ntitle: ' + title + '\ntags: []\npublish: false\n---\n\n## ' + title + '\n### 仕事\n### めし\n### 買い物\n### お勉強\n### 遊び\n').trimLeft();
}(date.format('YYYY-MM-DD'), title);

var dirPath = baseDir + date.format('YYYY/MM') + '/';
var fileName = date.format('DD') + '-' + key + '.md';
var filePath = dirPath + fileName;

// add directory
fs.mkdirsSync(appRootPath + dirPath);

// check file exists
var existsFile = glob.GlobSync(appRootPath + dirPath + date.format('DD') + '-*.md').found;
if (existsFile.length > 0) {
  console.error('Already created...: ' + existsFile.join(', '));
} else {
  // write file
  fs.writeFileSync(filePath, template);
  console.log('created!: ' + filePath);
}