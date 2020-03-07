import diff from '../src/index.js';

const dir = `${__dirname}/fixtures`;
const expected = [
  '{',
  '     host: hexlet.io',
  '   - timeout: 50',
  '   + timeout: 20',
  '   - proxy: 123.234.53.22',
  '   - follow: false',
  '   + verbose: true',
  '}'
];

const makeDiff = (extension) => {
  const filename1 = `${dir}/before.${extension}`;
  const filename2 = `${dir}/after.${extension}`;
  return diff(filename1, filename2);
};

test('test diff json', () => {
  const result = makeDiff('json');
  expect(result.join(' ')).toBe(expected.join(' '));
});

test('test diff yml', () => {
  const result = makeDiff('yml');
  expect(result.join(' ')).toBe(expected.join(' '));
});
