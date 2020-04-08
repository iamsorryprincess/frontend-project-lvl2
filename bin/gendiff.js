#!/usr/bin/env node
import program from 'commander';
import diff from '../src/index.js';

program
  .description('Compares two configuration files and shows the difference.')
  .version('1.0.0');

program
  .option('-f, --format [type]', 'output format', 'string');

program
  .arguments('<beforeFilePath> <afterFilePath>')
  .action((beforeFilePath, afterFilePath) => {
    console.log('');
    console.log(diff(beforeFilePath, afterFilePath, program.format));
    console.log('');
  });

program.parse(process.argv);
