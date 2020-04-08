import yaml from 'js-yaml';
import ini from 'ini';

const parse = (fileContent, fileExtension) => {
  switch (fileExtension) {
    case '.json':
      return JSON.parse(fileContent);
    
    case '.yml':
      return yaml.safeLoad(fileContent);

    case '.ini':
      return ini.parse(fileContent);

    default:
      throw new Error(`Unknown file extension: '${fileExtension}'!`);
  }
};

export default parse;
