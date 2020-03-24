#!/usr/bin/env node
import program from 'commander';
import diff from '../src/index.js';

program
  .description('Compares two configuration files and shows the difference.')
  .version('1.0.0');

program
  .option('-f, --format [type]', 'output format', 'string');

program
  .arguments('<firstFile> <secondFile>')
  .action((firstFile, secondFile) => {
    console.log('');
    console.log(diff(firstFile, secondFile, program.format));
    console.log('');
  });

program.parse(process.argv);
