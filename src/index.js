import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parse from './parsers.js';
import render from './formatters/formatter.js';
import states from './inner-states.js';

const conditions = [
  {
    condition: (object1, object2, key) => _.has(object2, key) && !_.has(object1, key),
    conditionResult: (key, object) => ({ name: key, value: object[key], action: states.added })
  },
  {
    condition: (object1, object2, key) => !_.has(object2, key) && _.has(object1, key),
    conditionResult: (key, object2, object1) => ({ name: key, value: object1[key], action: states.removed })
  },
  {
    condition: (object1, object2, key) => object1[key] === object2[key],
    conditionResult: (key, object) => ({ name: key, value: object[key], action: states.notModified })
  },
  {
    condition: (object1, object2, key) => !(_.isPlainObject(object1[key]) && _.isPlainObject(object2[key])),
    conditionResult: (key, object2, object1) => ({ name: key, value: object2[key], oldValue: object1[key], action: states.modified })
  },
  {
    condition: (object1, object2, key) => _.isPlainObject(object1[key]) && _.isPlainObject(object2[key]),
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
