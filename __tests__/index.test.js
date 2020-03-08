import diff from '../src/index.js';

const dir = `${__dirname}/fixtures`;
const expected = [
  ['common:', [
    'setting1: Value 1',
    '- setting2: 200',
    '- setting3: true',
    ['+ setting3:', ['key: value']],
    ['setting6:', ['key: value', '+ ops: vops']],
    '+ follow: false',
    '+ setting4: blah blah',
    ['+ setting5:', ['key5: value5']]
  ]],
  ['group1:', [
    '- baz: bas',
    '+ baz: bars',
    'foo: bar',
    ['- nest:', ['key: value']],
    '+ nest: str'
  ]],
  ['- group2:', ['abc: 12345']],
  ['+ group3:', ['fee: 100500']]
];

const makeDiff = (extension) => {
  const filename1 = `${dir}/before.${extension}`;
  const filename2 = `${dir}/after.${extension}`;
  const result = diff(filename1, filename2);
  expect(result.join(' ')).toBe(expected.join(' '));
};

test('test diff json', () => {
  makeDiff('json');
});

test('test diff yml', () => {
  makeDiff('yml');
});

test('test diff ini', () => {
  makeDiff('ini');
});
