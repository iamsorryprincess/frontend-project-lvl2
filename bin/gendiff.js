#!/usr/bin/env node

import program from 'commander';

program
  .version('0.1.0');

program.on('--help', () => {
  console.log('');
});

program.parse(process.argv);

console.log('stuff');
