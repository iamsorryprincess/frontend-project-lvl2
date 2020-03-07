import _ from 'lodash';
import parse from './parser.js';

const checkFiles = (file1, file2) => {
  const union = [...new Set(
    [...Object.keys(file1),
     ...Object.keys(file2)]
  )];

  const result = union.reduce((acc, key) => {
    if (_.has(file1, key) && _.has(file2, key)) {
      if (file2[key] === file1[key]) {
        acc.push(`     ${key}: ${file2[key]}`);
      } else {
        acc.push(`   - ${key}: ${file1[key]}`);
        acc.push(`   + ${key}: ${file2[key]}`);
      }
    } else if (_.has(file2, key)) {
      acc.push(`   + ${key}: ${file2[key]}`);
    } else {
      acc.push(`   - ${key}: ${file1[key]}`);
    }

    return acc;
  }, []);

  return ['{', ...result, '}'];
};

const diff = (filepath1, filepath2) => {
  const file1 = parse(filepath1);
  const file2 = parse(filepath2);
  return checkFiles(file1, file2);
};

export default diff;
