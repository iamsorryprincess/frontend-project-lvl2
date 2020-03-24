import diff from '../src/index.js';
import path from 'path';
import fs from 'fs';

const getRelativeFilePath = (filename) => {
  const commonFixturePath = '__tests__/__fixtures__';
  return path.join(commonFixturePath, filename);
};

const normalize = str => str.split('').sort().join();

const check = ({ fileBefore, fileAfter, expected, format }) => {
  const expectedFile = fs.readFileSync(getRelativeFilePath(expected), 'utf-8');
  const result = diff(`${__dirname}/__fixtures__/${fileBefore}`, `${__dirname}/__fixtures__/${fileAfter}`, format);
  if (format !== 'json') {
    expect(normalize(result)).toBe(normalize(expectedFile));
  } else {
    expect(
      JSON.stringify(JSON.parse(diff(`${__dirname}/__fixtures__/${fileBefore}`, `${__dirname}/__fixtures__/${fileAfter}`, format))))
        .toBe(JSON.stringify(JSON.parse(expectedFile)));
  }
};

test.each`
  fileBefore           | fileAfter            | expected                               | format      | extension
  ${'before.json'}     | ${'after.json'}      | ${'jsonStringBeforeAfterExpected.txt'} | ${'string'} | ${'.json'}
  ${'before.yml'}      | ${'after.yml'}       | ${'jsonStringBeforeAfterExpected.txt'} | ${'string'} | ${'.yml'}
  ${'before.ini'}      | ${'after.ini'}       | ${'jsonStringBeforeAfterExpected.txt'} | ${'string'} | ${'.ini'}
  ${'after.json'}      | ${'before.json'}     | ${'jsonStringAfterBeforeExpected.txt'} | ${'string'} | ${'.json'}
  ${'after.yml'}       | ${'before.yml'}      | ${'jsonStringAfterBeforeExpected.txt'} | ${'string'} | ${'.yml'}
  ${'after.ini'}       | ${'before.ini'}      | ${'jsonStringAfterBeforeExpected.txt'} | ${'string'} | ${'.ini'}
  ${'before.json'}     | ${'after.json'}      | ${'plainBeforeExpected.txt'}           | ${'plain'}  | ${'.json'}
  ${'before.yml'}      | ${'after.yml'}       | ${'plainBeforeExpected.txt'}           | ${'plain'}  | ${'.yml'}
  ${'before.ini'}      | ${'after.ini'}       | ${'plainBeforeExpected.txt'}           | ${'plain'}  | ${'.ini'}
  ${'after.json'}      | ${'before.json'}     | ${'plainAfterExpected.txt'}            | ${'plain'}  | ${'.json'}
  ${'after.yml'}       | ${'before.yml'}      | ${'plainAfterExpected.txt'}            | ${'plain'}  | ${'.yml'}
  ${'after.ini'}       | ${'before.ini'}      | ${'plainAfterExpected.txt'}            | ${'plain'}  | ${'.ini'}
  ${'before.json'}     | ${'after.json'}      | ${'jsonExpected.txt'}                  | ${'json'}   | ${'.json'}
  ${'before.yml'}      | ${'after.yml'}       | ${'jsonExpected.txt'}                  | ${'json'}   | ${'.yml'}
`('Check rendering for $format format for $extension file', check);
