import json from './string-formatter.js';
import plain from './plain-formatter.js';

const render = (data, format) => {
  switch (format) {
    case 'string':
      return json(data);

    case 'plain':
      return plain(data);

    case 'json':
      return JSON.stringify(data);

    default:
      return 'unknown format';
  }
};

export default render;
