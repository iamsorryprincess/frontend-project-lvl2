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

const diffKeys = (file1, file2) => {
  const union = _.union(_.keys(file1), _.keys(file2));
  const result = union.reduce((acc, key) => {
    const elem = { name: key };
    if (_.has(file1, key) && _.has(file2, key)) {
      if (file2[key] === file1[key]) {
        elem.action = 'not modified';
        elem.value = isKeyObject(file2, key) ? toNodeObject(file2[key]) : file2[key];
        acc.push(elem);
      } else {
        elem.action = 'modified';
        if (isKeyObject(file1, key) && isKeyObject(file2, key)) {
          elem.value = diffKeys(file1[key], file2[key], key);
          acc.push(elem);
          return acc;
        } else {
          elem.oldValue = isKeyObject(file1, key) ? toNodeObject(file1[key]) : file1[key];
          elem.value = isKeyObject(file2, key) ? toNodeObject(file2[key]) : file2[key];
          acc.push(elem);
        }
      }
    } else if (_.has(file2, key)) {
      elem.action = 'added';
      elem.value = isKeyObject(file2, key) ? toNodeObject(file2[key]) : file2[key];
      acc.push(elem);
    } else {
      elem.action = 'removed';
      elem.value = isKeyObject(file1, key) ? toNodeObject(file1[key]) : file1[key];
      acc.push(elem);
    }

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
