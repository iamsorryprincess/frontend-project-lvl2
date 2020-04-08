import _ from 'lodash';
import states from '../inner-states.js';

const buildStringName = (name, path) => path.length === 0 ? name : `${path.join('.')}.${name}`;
const buildStringValue = (value) => _.isArray(value) ? '[complex value]' : value;

const conditions = [
  {
    condition: (item) => item.action === states.modified && _.isArray(item.value) && _.isUndefined(item.oldValue),
    conditionResult: (item, path, callback) => callback(item.value, [...path, item.name])
  },
  {
    condition: (item) => item.action === states.modified && !_.isUndefined(item.oldValue),
    conditionResult: (item, path) => `Property ${buildStringName(item.name, path)} was changed from ${buildStringValue(item.oldValue)} to ${buildStringValue(item.value)}`
  },
  {
    condition: (item) => item.action === states.removed,
    conditionResult: (item, path) => `Property ${buildStringName(item.name, path)} was deleted`
  },
  {
    condition: (item) => item.action === states.added,
    conditionResult: (item, path) => `Property ${buildStringName(item.name, path)} was added with value: ${buildStringValue(item.value)}`
  },
  {
    condition: (item) => item.action === states.notModified,
    conditionResult: () => []
  }
];

const render = (diff) => {
  const inner = (nodes, path) => {
    const result = nodes.map(node => {
      const { conditionResult } = conditions.find(({ condition }) => condition(node));
      return conditionResult(node, path, inner);
    });
    return result.flat(Infinity);
  };

  const result = inner(diff, []);
  return result.join('\n');
};

export default render;
