import _ from 'lodash';
import states from '../inner-states.json';

const createChangedString = (item, value) => {
  return ['Property',
  value.join('.'),
  'was changed from',
  _.isObject(item.oldValue) ? '[complex value]' : item.oldValue,
  'to',
  _.isObject(item.value) ? '[complex value]' : item.value].join(' ');
}

const fillArrayComparsionResults = (item, acc, resultArray, callback) => {
  if (item.action === states.removed) {
    acc.push(item.name);
    resultArray.push(['Property', acc.join('.'), 'was deleted'].join(' '));
  } else {
    ifAdded(item, acc, resultArray, callback);
  }
};

const ifAdded = (item, acc, resultArray, callback) => {
  if (item.action === states.added) {
    acc.push(item.name);
    resultArray.push(['Property', acc.join('.'), 'was added with value:', _.isObject(item.value) ? '[complex value]' : item.value].join(' '));
  } else {
    ifArray(item, acc, resultArray, callback);
  }
};

const ifArray = (item, acc, resultArray, callback) => {
  acc.push(item.name);
  if (_.isArray(item.value)) {
    ifOldValue(item, acc, resultArray, callback);
  } else {
    ifModified(item, acc, resultArray);
  }
};

const ifModified = (item, acc, resultArray) => {
  if (item.action === states.modified) {
    resultArray.push(createChangedString(item, acc));
  }
}

const ifOldValue = (item, acc, resultArray, callback) => {
  if (item.oldValue !== undefined) {
    resultArray.push(createChangedString(item, acc));
  } else {
    callback(item.value);
  }
};

const render = (diff) => {
  const result = [];
  const value = [];

  const renderInner = (node) => {
    for (const item of node) {
      fillArrayComparsionResults(item, value, result, renderInner);
      value.pop();
    }
  }

  renderInner(diff);
  return result.join('\n');
};

export default render;
