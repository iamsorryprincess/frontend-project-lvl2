#!/usr/bin/env node
import program from 'commander';
import diff from '../src/index.js';
import render from '../src/renderer.js';

program
  .description('Compares two configuration files and shows the difference.')
  .version("1.0.0");

program
  .option('-f, --format [type]', 'output format');

program
  .arguments('<firstFile> <secondFile>')
  .action((firstFile, secondFile) => {
    console.log('');
    try {
      render(diff(firstFile, secondFile));
    } catch (error) {
      console.log(error.message);
    }
    console.log('');
  });

program.parse(process.argv);
