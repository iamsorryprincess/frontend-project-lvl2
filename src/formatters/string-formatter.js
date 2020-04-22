import _ from 'lodash';
import states from '../inner-states.js';

const addSign = (value, sign) => `${sign} ${value}`;

const addSpaces = (str, level) => {
  const longSpace = '    ';
  const shortSpace = '  ';
  const result = str[0] === '+' || str[0] === '-' ? `${shortSpace}${str}` : `${longSpace}${str}`;
  const addSpaceByLevel = (str, level, current) => current === level ? str : addSpaceByLevel(`${longSpace}${str}`, level, current + 1);
  return addSpaceByLevel(result, level, 1);
};

const renderNode= (name, value, level, sign = null) => {
  const buildString = (value) => !sign ? `${name}: ${value}` : addSign(`${name}: ${value}`, sign);

  if (!_.isObject(value)) {
    const result = buildString(value);
    return addSpaces(result, level);
  }

  const openString = addSpaces(buildString('{'), level);
  const valueString = _.keys(value).map(key => addSpaces(`${key}: ${value[key]}`, level + 1));
  const closeString = addSpaces('}', level);
  return `${openString}\n${valueString}\n${closeString}`;
};

const conditions = {
  [states.nested]: (item, level, callback) => {
    const openString = addSpaces(`${item.name}: {`, level);
    const valueString = callback(item.children, level);
    const closeString = addSpaces('}', level);
    return `${openString}\n${valueString}\n${closeString}`;
  },

  [states.modified]: (item, level) => {
    const oldValue = renderNode(item.name, item.oldValue, level, '-');
    const newValue = renderNode(item.name, item.newValue, level, '+');
    return `${oldValue}\n${newValue}`;
  },

  [states.notModified]: (item, level) => renderNode(item.name, item.value, level),
  [states.added]: (item, level) => renderNode(item.name, item.value, level, '+'),
  [states.removed]: (item, level) => renderNode(item.name, item.value, level, '-')
};

const render = (diff) => {
  const inner = (nodes, level) => {
    const result = nodes.map(node => {
      const conditionResult = conditions[node.type];
      return conditionResult(node, level + 1, inner);
    });
    return result.join('\n');
  }

  const result = inner(diff, 0);
  return `{\n${result}\n}`;
};

export default render;
