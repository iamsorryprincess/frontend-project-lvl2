import diff from '../src/index.js';

const dir = `${__dirname}/fixtures`;

test('test', () => {
  const filename1 = `${dir}/before.json`;
  const filename2 = `${dir}/after.json`;
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
  const result = diff(filename1, filename2);
  expect(result.join(' ')).toBe(expected.join(' '));
});
