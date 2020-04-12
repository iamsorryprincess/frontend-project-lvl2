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

const renderObject = (value, level) => {
  return _.keys(value).map(key => {
    const result = _.isObject(value[key]) ? renderObject(key, value[key], level + 1) : addSpaces(`${key}: ${value[key]}`, level + 1);
    return result;
  });
};

const renderNested= (name, value, level, callback, sign = null) => {
  const headerText = sign === null ? `${name}: {` : addSign(`${name}: {`, sign);
  const header = addSpaces(headerText, level);
  const body = _.isArray(value) ? callback(value, level) : renderObject(value, level);
  const footer = addSpaces('}', level);
  return `${header}\n${body}\n${footer}`;
};

const conditionsForModifiedNode = [
  {
    condition: (item) => _.isArray(item.value) && _.isUndefined(item.oldValue),
    conditionResult: (item, level, callback) => renderNested(item.name, item.value, level, callback)
  },
  {
    condition: (item) => _.isObject(item.value) && !_.isUndefined(item.oldValue) && _.isObject(item.oldValue),
    conditionResult: (item, level, callback) => `${renderNested(item.name, item.oldValue, level, callback, '-')}\n${renderNested(item.name, item.value, level, callback, '+')}`
  },
  {
    condition: (item) => _.isObject(item.value) && !_.isUndefined(item.oldValue) && !_.isObject(item.oldValue),
    conditionResult: (item, level, callback) => `${addSpaces(addSign(`${item.name}: ${item.oldValue}`, '-'), level)}\n${renderNested(item.name, item.value, level, callback, '+')}`
  },
  {
    condition: (item) => !_.isObject(item.value) && !_.isUndefined(item.oldValue) && _.isObject(item.oldValue),
    conditionResult: (item, level, callback) => `${renderNested(item.name, item.oldValue, level, callback, '-')}\n${addSpaces(addSign(`${item.name}: ${item.value}`, '+'), level)}`
  },
  {
    condition: (item) => !_.isObject(item.value) && !_.isUndefined(item.oldValue) && !_.isObject(item.oldValue),
    conditionResult: (item, level) => `${addSpaces(addSign(`${item.name}: ${item.oldValue}`, '-'), level)}\n${addSpaces(addSign(`${item.name}: ${item.value}`, '+'), level)}`
  }
];

const conditions = [
  {
    condition: (item) => item.action === states.modified,
    conditionResult: (item, level, callback) => {
      const { conditionResult } = conditionsForModifiedNode.find(({ condition }) => condition(item));
      return conditionResult(item, level, callback);
    }
  },
  {
    condition: (item) => item.action === states.notModified && !_.isObject(item.value),
    conditionResult: (item, level) => addSpaces(`${item.name}: ${item.value}`, level)
  },
  {
    condition: (item) => item.action === states.notModified && _.isObject(item.value),
    conditionResult: (item, level) => renderNested(item.name, item.value, level)
  },
  {
    condition: (item) => item.action === states.added && !_.isObject(item.value),
    conditionResult: (item, level) => addSpaces(addSign(`${item.name}: ${item.value}`, '+'), level)
  },
  {
    condition: (item) => item.action === states.added && _.isObject(item.value),
    conditionResult: (item, level, callback) => renderNested(item.name, item.value, level, callback, '+')
  },
  {
    condition: (item) => item.action === states.removed && !_.isObject(item.value),
    conditionResult: (item, level) => addSpaces(addSign(`${item.name}: ${item.value}`, '-'), level)
  },
  {
    condition: (item) => item.action === states.removed && _.isObject(item.value),
    conditionResult: (item, level, callback) => renderNested(item.name, item.value, level, callback, '-')
  }
];

const render = (diff) => {
  const inner = (nodes, level) => {
    const result = nodes.map(node => {
      const { conditionResult } = conditions.find(({ condition }) => condition(node));
      return conditionResult(node, level + 1, inner);
    });
    return result.join('\n');
  }

  const result = inner(diff, 0);
  return `{\n${result}\n}`;
};

export default render;
