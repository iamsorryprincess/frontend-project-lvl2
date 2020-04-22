import _ from 'lodash';
import states from '../inner-states.js'

const buildStringName = (name, path) => path.length === 0 ? name : `${path.join('.')}.${name}`;
const buildStringValue = (value) => _.isObject(value) ? '[complex value]' : value;

const conditions = {
  [states.nested]: (item, path, callback) => callback(item.children, [...path, item.name]),
  [states.modified]: (item, path) => `Property ${buildStringName(item.name, path)} was changed from ${buildStringValue(item.oldValue)} to ${buildStringValue(item.newValue)}`,
  [states.removed]: (item, path) => `Property ${buildStringName(item.name, path)} was deleted`,
  [states.added]: (item, path) => `Property ${buildStringName(item.name, path)} was added with value: ${buildStringValue(item.value)}`,
  [states.notModified]: () => []
};

const render = (diff) => {
  const inner = (nodes, path) => {
    const result = nodes.map(node => {
      const conditionResult = conditions[node.type];
      return conditionResult(node, path, inner);
    });
    return result.flat(Infinity);
  };

  const result = inner(diff, []);
  return result.join('\n');
};

export default render;
