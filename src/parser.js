import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parse = (filename) => {
  const ext = path.extname(filename);
  const file = readFileSync(filename, 'utf-8');

  switch (ext) {
    case '.json':
      return JSON.parse(file);
    
    case '.yml':
      return yaml.safeLoad(file);

    case '.ini':
      return ini.parse(file);
  }
};

export default parse;
