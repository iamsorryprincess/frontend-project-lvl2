import _ from 'lodash';

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

const render = (file) => {
  console.log('{');

  const renderInner = (node, level) => {
    for (const item of node) {
      if (_.isArray(item)) {
        console.log(addSpaces(`${item[0]} {`, level));
        renderInner(item[1], level + 1);
      } else {
        console.log(addSpaces(item, level));
      }
    }

    if (level !== 0) {
      console.log(addSpaces('}', level - 1));
    }  
  }

  renderInner(file, 0);
  console.log('}');
};

export default render;
