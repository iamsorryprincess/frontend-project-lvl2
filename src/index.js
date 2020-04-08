import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parse from './parser.js';
import render from './formatters/formatter.js';
import states from './inner-states.js';

const isKeyObject = (object, key) => _.isObject(object[key]) && !_.isArray(object[key]);

const toNodeObject = (object, key) => {
  return !isKeyObject(object, key) ? object[key] : _.keys(object[key]).map((innerKey) => {
    return {
      name: innerKey,
      value: object[key][innerKey],
      action: states.notModified
    }
  });
};

const conditions = [
  {
    condition: (object1, object2, key) => _.has(object2, key) && !_.has(object1, key),
    conditionResult: (key, object) => ({ name: key, value: toNodeObject(object, key), action: states.added })
  },
  {
    condition: (object1, object2, key) => !_.has(object2, key) && _.has(object1, key),
    conditionResult: (key, object2, object1) => ({ name: key, value: toNodeObject(object1, key), action: states.removed })
  },
  {
    condition: (object1, object2, key) => object1[key] === object2[key],
    conditionResult: (key, object) => ({ name: key, value: toNodeObject(object, key), action: states.notModified })
  },
  {
    condition: (object1, object2, key) => !(isKeyObject(object1, key) && isKeyObject(object2, key)),
    conditionResult: (key, object2, object1) => ({ name: key, value: toNodeObject(object2, key), oldValue: toNodeObject(object1, key), action: states.modified })
  },
  {
    condition: (object1, object2, key) => isKeyObject(object1, key) && isKeyObject(object2, key),
    conditionResult: (key, object2, object1, callback) => ({ name: key, value: callback(object1[key], object2[key]), action: states.modified })
  }
];

const diffKeys = (dataBefore, dataAfter) => {
  const union = _.union(_.keys(dataBefore), _.keys(dataAfter)); 
  return union.map((key) => {
    const { conditionResult } = conditions.find(({ condition }) => condition(dataBefore, dataAfter, key));
    return conditionResult(key, dataAfter, dataBefore, diffKeys);
  });
};

const diff = (filepathBefore, filepathAfter, format) => {
  const fileContentBefore = readFileSync(filepathBefore, 'utf-8');
  const fileContentAfter = readFileSync(filepathAfter, 'utf-8');
  const dataBefore = parse(fileContentBefore, path.extname(filepathBefore));
  const dataAfter = parse(fileContentAfter, path.extname(filepathAfter));
  const dif = diffKeys(dataBefore, dataAfter);
  return render(dif, format);
};

export default diff;
