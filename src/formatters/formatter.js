import json from './json-formatter.js';
import plain from './plain-formatter.js';

const render = (file, format) => {
  switch (format) {
    case 'json':
      return json(file);

    case 'plain':
      return plain(file);

    default:
      return 'unknown format';
  }
};

export default render;
