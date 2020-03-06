#!/usr/bin/env node
import program from 'commander';
import diff from '../src/index.js';

const print = (file) => {
  for (const item of file) {
    console.log(item);
  }
};

program
  .description('Compares two configuration files and shows the difference.')
  .version("1.0.0");

program
  .option('-f, --format [type]', 'output format');

program
  .arguments('<firstFile> <secondFile>')
  .action((firstFile, secondFile) => {
    console.log('');
    print(diff(firstFile, secondFile));
    console.log('');
  });

program.parse(process.argv);
