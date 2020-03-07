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
  const result = diff(filename1, filename2);
  expect(result.join(' ')).toBe(expected.join(' '));
};

test('test diff', () => {
  makeDiff('json');
  makeDiff('yml');
  makeDiff('ini');
});
