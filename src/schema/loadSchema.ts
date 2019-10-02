import fs from 'fs';
import path from 'path';

export const loadSchema = (basePath = __dirname) => {
  const files = fs.readdirSync(basePath);
  const schemaFiles = files.filter(file => file.endsWith('.graphql'));
  return schemaFiles.map(file =>
    fs.readFileSync(path.join(basePath, file), 'utf8')
  );
};
