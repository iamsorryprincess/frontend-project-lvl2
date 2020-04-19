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

const renderTitle = (name, level, sign = null) => {
  const headerText = sign === null ? `${name}: {` : addSign(`${name}: {`, sign);
  const header = addSpaces(headerText, level);
  const footer = addSpaces('}', level);
  return { header, footer };
};

const renderNode= (name, value, level, sign = null) => {
  if (!_.isObject(value)) {
    const result = !sign ? `${name}: ${value}` : addSign(`${name}: ${value}`, sign);
    return !sign ? addSpaces(result, level) : addSpaces(result, level);
  }

  const { header, footer } = renderTitle(name, level, sign);
  const body = _.keys(value).map(key => addSpaces(`${key}: ${value[key]}`, level + 1));
  return `${header}\n${body}\n${footer}`;
};

const conditions = [
  {
    condition: (item) => item.type === states.nested,
    conditionResult: (item, level, callback) => {
      const { header, footer } = renderTitle(item.name, level);
      const body = callback(item.children, level);
      return `${header}\n${body}\n${footer}`;
    }
  },
  {
    condition: (item) => item.type === states.modified,
    conditionResult: (item, level) => {
      const oldValue = renderNode(item.name, item.oldValue, level, '-');
      const newValue = renderNode(item.name, item.newValue, level, '+');
      return `${oldValue}\n${newValue}`;
    }
  },
  {
    condition: (item) => item.type === states.notModified,
    conditionResult: (item, level) => renderNode(item.name, item.value, level)
  },
  {
    condition: (item) => item.type === states.added,
    conditionResult: (item, level) => renderNode(item.name, item.value, level, '+')
  },
  {
    condition: (item) => item.type === states.removed,
    conditionResult: (item, level) => renderNode(item.name, item.value, level, '-')
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
