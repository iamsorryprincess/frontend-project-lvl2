import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parse = (filename) => {
  const ext = path.extname(filename);
  const file = readFileSync(filename);

  switch (ext) {
    case '.json':
      return JSON.parse(file);
    
    case '.yml':
      return yaml.safeLoad(file);
  }
};

export default parse;
