import _ from 'lodash';
import parse from './parser.js';
import render from './formatters/formatter.js';

const isKeyObject = (object, key) => _.isObject(object[key]) && !_.isArray(object[key]);

const toNodeObject = (object) => {
  return _.keys(object).map((key) => {
    return {
      name: key,
      value: object[key],
      action: 'not modified'
    }
  });
}

const createTreeObject = (afterFile, key, action, beforeFile = null) => {
  return {
    name: key,
    action: action,
    value: isKeyObject(afterFile, key) ? toNodeObject(afterFile[key]) : afterFile[key],
    oldValue: beforeFile === null ? undefined : isKeyObject(beforeFile, key) ? toNodeObject(beforeFile[key]) : beforeFile[key]
  };
}

const same = (file1, file2, key) => _.has(file1, key) && _.has(file2, key) ? unchanged(file1, file2, key) : added(file1, file2, key);
const unchanged = (file1, file2, key) => file2[key] === file1[key] ? createTreeObject(file2, key, 'not modified') : changed(file1, file2, key);
const added = (file1, file2, key) => _.has(file2, key) && !_.has(file1, key) ? createTreeObject(file2, key, 'added') : removed(file1, file2, key);
const removed = (file1, file2, key) => !_.has(file2, key) && _.has(file1, key) ? createTreeObject(file1, key, 'removed') : null;
const changed = (file1, file2, key) => isKeyObject(file1, key) && isKeyObject(file2, key) 
  ? { name: key, action: 'modified', value: 'empty' }
  : createTreeObject(file2, key, 'modified', file1);

const diffKeys = (file1, file2) => {
  const union = _.union(_.keys(file1), _.keys(file2));
  const result = union.reduce((acc, key) => {
    const elem = same(file1, file2, key);
    if (elem.value === 'empty') {
      elem.value = diffKeys(file1[key], file2[key]);
    }

    acc.push(elem);
    return acc;
  }, []);

  return result;
};

const diff = (filepath1, filepath2, format) => {
  const file1 = parse(filepath1);
  const file2 = parse(filepath2);
  const dif = diffKeys(file1, file2);
  return render(dif, format);
};

export default diff;
