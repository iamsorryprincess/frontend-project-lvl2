import diff from '../src/index.js';

const dir = `${__dirname}/fixtures`;

const beforeJson = `${dir}/before.json`;
const beforeYml = `${dir}/before.yml`;
const beforeIni = `${dir}/before.ini`;
const afterJson = `${dir}/after.json`;
const afterYml = `${dir}/after.yml`;
const afterIni = `${dir}/after.ini`;

const jsonStringBeforeAfterExpected = `{
    common: {
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
        setting6: {
            key: value
          + ops: vops
        }
      + follow: false
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}`;

const jsonStringAfterBeforeExpected = `{
    common: {
      - follow: false
        setting1: Value 1
      - setting3: {
            key: value
        }
      + setting3: true
      - setting4: blah blah
      - setting5: {
            key5: value5
        }
        setting6: {
            key: value
          - ops: vops
        }
      + setting2: 200
    }
    group1: {
        foo: bar
      - baz: bars
      + baz: bas
      - nest: str
      + nest: {
            key: value
        }
    }
  - group3: {
        fee: 100500
    }
  + group2: {
        abc: 12345
    }
}`;

const plainBeforeAfterExpected = `Property common.setting2 was deleted
Property common.setting3 was changed from true to [complex value]
Property common.setting6.ops was added with value: vops
Property common.follow was added with value: false
Property common.setting4 was added with value: blah blah
Property common.setting5 was added with value: [complex value]
Property group1.baz was changed from bas to bars
Property group1.nest was changed from [complex value] to str
Property group2 was deleted
Property group3 was added with value: [complex value]`;

const plainAfterBeforeExpected = `Property common.follow was deleted
Property common.setting3 was changed from [complex value] to true
Property common.setting4 was deleted
Property common.setting5 was deleted
Property common.setting6.ops was deleted
Property common.setting2 was added with value: 200
Property group1.baz was changed from bars to bas
Property group1.nest was changed from str to [complex value]
Property group3 was deleted
Property group2 was added with value: [complex value]`;

const jsonExpected = `{"properies":[{"name":"common","action":"modified","value":[{"name":"setting1","action":"not modified","value":"Value 1"},{"name":"setting2","action":"removed","value":200},{"name":"setting3","action":"modified","value":[{"name":"key","value":"value","action":"not modified"}],"oldValue":true},{"name":"setting6","action":"modified","value":[{"name":"key","action":"not modified","value":"value"},{"name":"ops","action":"added","value":"vops"}]},{"name":"follow","action":"added","value":false},{"name":"setting4","action":"added","value":"blah blah"},{"name":"setting5","action":"added","value":[{"name":"key5","value":"value5","action":"not modified"}]}]},{"name":"group1","action":"modified","value":[{"name":"baz","action":"modified","value":"bars","oldValue":"bas"},{"name":"foo","action":"not modified","value":"bar"},{"name":"nest","action":"modified","value":"str","oldValue":[{"name":"key","value":"value","action":"not modified"}]}]},{"name":"group2","action":"removed","value":[{"name":"abc","value":12345,"action":"not modified"}]},{"name":"group3","action":"added","value":[{"name":"fee","value":100500,"action":"not modified"}]}]}`;

const normalize = str => str.split('').sort().join();

const check = ({ fileBefore, fileAfter, expected, format }) => {
  const result = diff(fileBefore, fileAfter, format);
  if (format !== 'json') {
    expect(normalize(result)).toBe(normalize(expected));
  } else {
    expect(JSON.stringify(JSON.parse(diff(fileBefore, fileAfter, format)))).toBe(JSON.stringify(JSON.parse(expected)));
  }
};

test.each`
  fileBefore        | fileAfter         | expected                         | format      | extension
  ${beforeJson}     | ${afterJson}      | ${jsonStringBeforeAfterExpected} | ${'string'} | ${'.json'}
  ${beforeYml}      | ${afterYml}       | ${jsonStringBeforeAfterExpected} | ${'string'} | ${'.yml'}
  ${beforeIni}      | ${afterIni}       | ${jsonStringBeforeAfterExpected} | ${'string'} | ${'.ini'}
  ${afterJson}      | ${beforeJson}     | ${jsonStringAfterBeforeExpected} | ${'string'} | ${'.json'}
  ${afterYml}       | ${beforeYml}      | ${jsonStringAfterBeforeExpected} | ${'string'} | ${'.yml'}
  ${afterIni}       | ${beforeIni}      | ${jsonStringAfterBeforeExpected} | ${'string'} | ${'.ini'}
  ${beforeJson}     | ${afterJson}      | ${plainBeforeAfterExpected}      | ${'plain'}  | ${'.json'}
  ${beforeYml}      | ${afterYml}       | ${plainBeforeAfterExpected}      | ${'plain'}  | ${'.yml'}
  ${beforeIni}      | ${afterIni}       | ${plainBeforeAfterExpected}      | ${'plain'}  | ${'.ini'}
  ${afterJson}      | ${beforeJson}     | ${plainAfterBeforeExpected}      | ${'plain'}  | ${'.json'}
  ${afterYml}       | ${beforeYml}      | ${plainAfterBeforeExpected}      | ${'plain'}  | ${'.yml'}
  ${afterIni}       | ${beforeIni}      | ${plainAfterBeforeExpected}      | ${'plain'}  | ${'.ini'}
  ${beforeJson}     | ${afterJson}      | ${jsonExpected}                  | ${'json'}   | ${'.json'}
  ${beforeYml}      | ${afterYml}       | ${jsonExpected}                  | ${'json'}   | ${'.yml'}
`('Check rendering for $format format for $extension file', check);
