import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import render from './formatters/index.js';
import states from './inner-states.js';
import parsers from './parsers.js';

const conditions = [
  {
    condition: (object1, object2, key) => _.has(object2, key) && !_.has(object1, key),
    conditionResult: (key, object) => ({ name: key, value: object[key], type: states.added })
  },
  {
    condition: (object1, object2, key) => !_.has(object2, key) && _.has(object1, key),
    conditionResult: (key, object2, object1) => ({ name: key, value: object1[key], type: states.removed })
  },
  {
    condition: (object1, object2, key) => object1[key] === object2[key],
    conditionResult: (key, object) => ({ name: key, value: object[key], type: states.notModified })
  },
  {
    condition: (object1, object2, key) => !(_.isPlainObject(object1[key]) && _.isPlainObject(object2[key])),
    conditionResult: (key, object2, object1) => ({ name: key, newValue: object2[key], oldValue: object1[key], type: states.modified })
  },
  {
    condition: (object1, object2, key) => _.isPlainObject(object1[key]) && _.isPlainObject(object2[key]),
    conditionResult: (key, object2, object1, callback) => ({ name: key, children: callback(object1[key], object2[key]), type: states.nested })
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
  const parseBefore = parsers(path.extname(filepathBefore).slice(1));
  const parseAfter = parsers(path.extname(filepathAfter).slice(1));
  const dataBefore = parseBefore(fileContentBefore);
  const dataAfter = parseAfter(fileContentAfter);
  const diffResult = diffKeys(dataBefore, dataAfter);
  return render(diffResult, format);
};

export default diff;
