import _ from 'lodash';

const render = (diff) => {
  const result = [];
  const value = [];

  const renderInner = (node) => {
    for (const item of node) {
      if (item.action === 'removed') {
        value.push(item.name);
        result.push([
          'Property',
          value.join('.'),
          'was deleted'].join(' '));
      } else if (item.action === 'added') {
        value.push(item.name);
        result.push([
          'Property',
          value.join('.'),
          'was added with value:',
          _.isObject(item.value) ? '[complex value]' : item.value].join(' '));
      } else {
        value.push(item.name);
        if (_.isArray(item.value)) {
          if (item.oldValue !== undefined) {
            result.push([
              'Property',
              value.join('.'),
              'was changed from',
              _.isObject(item.oldValue) ? '[complex value]' : item.oldValue,
              'to',
              _.isObject(item.value) ? '[complex value]' : item.value].join(' '));
          } else {
            renderInner(item.value);
          }
        } else if (item.action === 'modified') {
          result.push([
            'Property',
            value.join('.'),
            'was changed from',
            _.isObject(item.oldValue) ? '[complex value]' : item.oldValue,
            'to',
            _.isObject(item.value) ? '[complex value]' : item.value].join(' '));
        }
      }
      value.pop();
    }
  }

  renderInner(diff);
  return result.join('\n');
};

export default render;
