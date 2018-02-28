#!/usr/bin/env node

const path = require('path');
const cac = require('cac');
const sao = require('sao');
const update = require('update-notifier');

const pkg = require('./package');

const cli = cac();

cli.command('*', 'Generate a new package', input => {
  const folderName = input[0] || '.';
  const targetPath = path.resolve(folderName);
  console.log(`> Generating package in ${targetPath}`);

  const templatePath = path.dirname(require.resolve('./package'));

  // root
  return sao({
    template: templatePath,
    targetPath
  });
});

cli.parse();

update({
  pkg
}).notify();
