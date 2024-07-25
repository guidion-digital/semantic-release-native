import fs from 'fs';
import { coerce } from 'semver';

export const readFile = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

export const writeFile = (path: string, contents: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, contents, (err) => {
      if (err) reject(err);
      resolve('saved: ' + path);
    });
  });
}

export const readDir = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    return fs.readdir(path, function (err, filenames) {
      if (err) {
        throw ('directory not found' + path);
      }
      resolve(filenames);
    });
  });
}

export const getVersionCode = (nextVersion: string) => {
  const next = coerce(nextVersion);

  if (!next) {
    throw new Error('Invalid version number');
  }

  if (next.minor > 99 || next.patch > 99) {
    throw new Error('Cannot have minor or patch versions greater than 99');
  }

  return next.major * 10000 + next.minor * 100 + next.patch;
};
