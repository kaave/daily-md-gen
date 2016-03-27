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
  name: 'title',
  short: 't',
  type: 'string',
  description: 'create title(my-birth-day), default=ordinary-day',
  example: "'--title=my-birth-day' or '-t 2016/09/24'"
}]).run().options;

var date = args.date && args.date.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/) ? moment(args.date) : moment();
var title = args.title || 'ordinaly-day';
var template = function (date, title) {
  return ('\n---\ndate: ' + date + '\ntitle: ' + title + '\ntags: []\n---\n\n# ' + title + '\n').trimLeft();
}(date.format('YYYY-MM-DD'), title);

var dirPath = baseDir + date.format('YYYY/MM') + '/';
var fileName = date.format('DD') + '-' + title + '.md';
var filePath = dirPath + fileName;

// add directory
fs.mkdirsSync(appRootPath + dirPath);

// check file exists
var existsFile = glob.GlobSync(appRootPath + dirPath + date.format('DD') + '-*.md').found;
if (existsFile.length > 0) {
  console.log('Already created...: ' + existsFile.join(', '));
} else {
  // write file
  fs.writeFileSync(filePath, template);
  console.log('created!: ' + filePath);
}