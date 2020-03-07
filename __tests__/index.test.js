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

test('test diff json', () => {
  const filename1 = `${dir}/before.json`;
  const filename2 = `${dir}/after.json`;
  const result = diff(filename1, filename2);
  expect(result.join(' ')).toBe(expected.join(' '));
});

test('test diff yml', () => {
  const filename1 = `${dir}/before.yml`;
  const filename2 = `${dir}/after.yml`;
  const result = diff(filename1, filename2);
  expect(result.join(' ')).toBe(expected.join(' '));
});
