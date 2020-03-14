import _ from 'lodash';
import states from '../inner-states.js';

const addSpaces = (str, level) => {
  const longSpace = '    ';
  const shortSpace = '  ';
  const count = level + 1;
  str = str[0] === '+' || str[0] === '-' ? `${shortSpace}${str}` : `${longSpace}${str}`;
  for (let i = 1; i < count; i += 1) {
    str = `${longSpace}${str}`
  }
  return str;
};

const setSign = (name, action, value = null) => {
  const result = value === null ? `${name}: {` : `${name}: ${value}`;
  switch (action) {
    case states.modified:
    case states.notModified:
      return result;

    case states.added:
      return `+ ${result}`;

    case states.removed:
      return `- ${result}`;
  }
};

const fillArrayComparsionResults = (item, level, array, callback) => {
  const values = ifValueModified(item, level);
  if (!_.isNull(values.oldValue)) {
    array.push(values.oldValue);
    if (values.oldValue.includes('{')) {
      callback(item.oldValue, level + 1);
    }
  }
  array.push(values.value);
  if (values.value.includes('{')) {
    callback(item.value, level + 1);
  }
};

const ifValueModified = (item, level) => {
  if (item.action === states.modified) {
    const oldValue = ifOldValue(item, level);
    const value = ifValueChangedArray(item, level);
    return { value, oldValue };

  } else {
    const value = ifValueNotChangedArray(item.name, item.value, level, item.action);
    return { value, oldValue: null };
  }
};

const ifOldValue = (item, level) => item.oldValue !== undefined
  ? ifValueNotChangedArray(item.name, item.oldValue, level, states.removed)
  : null;

const ifValueNotChangedArray = (name, value, level, action) => _.isArray(value)
  ? addSpaces(setSign(name, action), level)
  : addSpaces(setSign(name, action, value), level);

const ifValueChangedArray = (item, level) => _.isArray(item.value)
  ? addSpaces(setSign(item.name, item.oldValue === undefined ? item.action : states.added), level)
  : addSpaces(setSign(item.name, states.added, item.value), level);

const render = (diff) => {
  const result = [];
  result.push('{');

  const renderInner = (node, level) => {
    node.forEach(item => fillArrayComparsionResults(item, level, result, renderInner));
    if (level !== 0) {
      result.push(addSpaces('}', level - 1));
    }
  };

  renderInner(diff, 0);
  result.push('}');
  return result.join('\n');
};

export default render;
