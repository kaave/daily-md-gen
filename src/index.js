const argv = require('argv');
const moment = require('moment');
const fs = require('fs-extra');
const glob = require('glob');
const appRootPath = require('app-root-path').path + '/';

const packageJson = require(`${appRootPath}package.json`);
const baseDir = packageJson.posts || 'posts/';

const args = argv.option([
  {
    name: 'date',
    short: 'd',
    type: 'string',
    description: 'create date(YYYY-MM-DD or YYYY/MM/DD), default=today',
    example: "'--date=2016-09-24' or '-d 2016/09/24'"
  },
  {
    name: 'title',
    short: 't',
    type: 'string',
    description: 'create title(my-birth-day), default=ordinary-day',
    example: "'--title=my-birth-day' or '-t 2016/09/24'"
  }
]).run().options;

const date = args.date && args.date.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/) ? moment(args.date) : moment();
const title = args.title || 'ordinaly-day';
const template = ((date, title) => `
---
date: ${date}
title: ${title}
tags: []
---

# ${title}
`.trimLeft()
)(date.format('YYYY-MM-DD'), title);

const dirPath = `${baseDir + date.format('YYYY/MM')}/`;
const fileName = `${date.format('DD')}-${title}.md`;
const filePath = dirPath + fileName;

// add directory
fs.mkdirsSync(appRootPath + dirPath);

// check file exists
const existsFile = glob.GlobSync(`${appRootPath + dirPath + date.format('DD')}-*.md`).found;
if (existsFile.length > 0) {
  console.log(`Already created...: ${existsFile.join(', ')}`);
} else {
  // write file
  fs.writeFileSync(filePath, template);
  console.log(`created!: ${filePath}`);
}

