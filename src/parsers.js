import yaml from 'js-yaml';
import ini from 'ini';

const getParser = (fileExtension) => {
  switch (fileExtension) {
    case '.json':
      return JSON.parse;
    
    case '.yml':
      return yaml.safeLoad;

    case '.ini':
      return ini.parse;

    default:
      throw new Error(`Unknown file extension: '${fileExtension}'!`);
  }
};

const parse = (data, extension) => {
  const parseFileData = getParser(extension);
  return parseFileData(data);
}

export default parse;
