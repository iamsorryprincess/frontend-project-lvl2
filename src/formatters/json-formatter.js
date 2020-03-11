import _ from 'lodash';

const modifiedText = 'modified';
const notModifiedText = 'not modified';
const addedText = 'added';
const removedText = 'removed';

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
    case modifiedText:
    case notModifiedText:
      return result;

    case addedText:
      return `+ ${result}`;

    case removedText:
      return `- ${result}`;
  }
}

const render = (diff) => {
  const result = [];
  result.push('{');

  const renderInner = (node, level) => {
    for (const item of node) {
      if (item.action === modifiedText) {
        if (item.oldValue !== undefined) {
          if (_.isArray(item.oldValue)) {
            result.push(addSpaces(setSign(item.name, removedText), level));
            renderInner(item.oldValue, level + 1);
          } else {
            result.push(addSpaces(setSign(item.name, removedText, item.oldValue), level));
          }
        }      
        if (_.isArray(item.value)) {
          result.push(addSpaces(setSign(item.name, item.oldValue === undefined ? item.action : addedText), level));
          renderInner(item.value, level + 1);
        } else {
          result.push(addSpaces(setSign(item.name, addedText, item.value), level));
        }
      }
       else if (_.isArray(item.value)) {
        result.push(addSpaces(setSign(item.name, item.action), level));
        renderInner(item.value, level + 1);
      } else {
        result.push(addSpaces(setSign(item.name, item.action, item.value), level));
      }
    }

    if (level !== 0) {
      result.push(addSpaces('}', level - 1));
    }  
  }

  renderInner(diff, 0);
  result.push('}');
  return result.join('\n');
};

export default render;
