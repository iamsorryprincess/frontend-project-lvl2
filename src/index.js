import _ from 'lodash';
import parse from './parser.js';

const isKeyObject = (object, key) => _.isObject(object[key]) && !_.isArray(object[key]);
const toArray = object => _.keys(object).map(key => `${key}: ${object[key]}`);

const diffKeys = (file1, file2, name = null) => {
  const union = _.union(_.keys(file1), _.keys(file2));
  const result = union.reduce((acc, key) => {
    if (_.has(file1, key) && _.has(file2, key)) {
      if (file2[key] === file1[key]) {
        acc.push(isKeyObject(file2, key) ? `${key}: ${toArray(file2[key])}` : `${key}: ${file2[key]}`);
      } else {
        if (isKeyObject(file1, key) && isKeyObject(file2, key)) {
          acc.push(diffKeys(file1[key], file2[key], key));
          return acc;
        } else {
          acc.push(isKeyObject(file1, key) ? [`- ${key}:`, toArray(file1[key])] : `- ${key}: ${file1[key]}`);
          acc.push(isKeyObject(file2, key) ? [`+ ${key}:`, toArray(file2[key])] : `+ ${key}: ${file2[key]}`);
        }
      }
    } else if (_.has(file2, key)) {
      acc.push(isKeyObject(file2, key) ? [`+ ${key}:`, toArray(file2[key])] : `+ ${key}: ${file2[key]}`);
    } else {
      acc.push(isKeyObject(file1, key) ? [`- ${key}:`, toArray(file1[key])] : `- ${key}: ${file1[key]}`);
    }

    return acc;
  }, []);

  return !name ? [...result] : [`${name}:`, result];
};

const diff = (filepath1, filepath2) => {
  const file1 = parse(filepath1);
  const file2 = parse(filepath2);
  return diffKeys(file1, file2);
};

export default diff;
