import json from './json-formatter.js';
import plain from './plain-formatter.js';

const render = (file, format) => {
  switch (format) {
    case 'string':
      return json(file);

    case 'plain':
      return plain(file);

    case 'json':
      return JSON.stringify({ properies: file });

    default:
      return 'unknown format';
  }
};

export default render;
