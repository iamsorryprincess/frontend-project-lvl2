import diff from '../src/index.js';
import path from 'path';
import fs from 'fs';

const getRelativeFilePath = (filename) => {
  const commonFixturePath = '__tests__/__fixtures__';
  return path.join(commonFixturePath, filename);
};

const check = ({ format, extension }) => {
  const expected = fs.readFileSync(getRelativeFilePath(`${format}.txt`), 'utf-8');
  const before = getRelativeFilePath(`before.${extension}`);
  const after = getRelativeFilePath(`after.${extension}`);
  const actual = diff(before, after, format);
  expect(actual).toBe(expected);
};

test.each`
  format      | extension
  ${'string'} | ${'json'}
  ${'string'} | ${'yml'}
  ${'string'} | ${'ini'}
  ${'plain'}  | ${'json'}
  ${'plain'}  | ${'yml'}
  ${'plain'}  | ${'ini'}
  ${'json'}   | ${'json'}
  ${'json'}   | ${'yml'}
`('Check rendering for $format format for $extension file', check);
