import path from 'path';
import { writeFile } from './utils';
import { mkdir } from 'fs/promises';
import { Context } from './interfaces';

export const writeNotesToFastlane = async (osPath: string, osSpecifier: string, languages: string[], version: number, releaseNotes: string, log: Context['logger']['log']) => {
  return Promise.all([languages.map(async language => {
    const metaDataPath = path.join(osPath, 'fastlane', 'metadata', osSpecifier, language);
    const notesPath = path.join(metaDataPath, `${version}.txt`);
    log('[📝] Writing release notes to', notesPath);

    return mkdir(metaDataPath, { recursive: true })
      .then(() => writeFile(notesPath, releaseNotes));
  })]);
}
