#!/usr/bin/env node
import program from 'commander';
import diff from '../src/index.js';

program
  .description('Compares two configuration files and shows the difference.')
  .version('1.0.0');

program
  .option('-f, --format [type]', 'output format', 'json');

program
  .arguments('<firstFile> <secondFile>')
  .action((firstFile, secondFile) => {
    console.log('');
    try {
      console.log(diff(firstFile, secondFile, program.format));
    } catch (error) {
      console.log(error.message);
    }
    console.log('');
  });

program.parse(process.argv);
