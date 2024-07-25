import path from 'path';
import { writeFile } from './utils';
import { mkdir } from 'fs/promises';
import { Context } from './interfaces';

export const writeNotesToFastlane = async (androidPath: string, iOSPath: string, languages: string[], version: number, releaseNotes: string, log: Context['logger']['log']) => {
  const writeNotes = (osPath: string, fileName: string) => {
    return Promise.all([languages.map(async language => {
      const metaDataPath = path.join(osPath, language);
      const notesPath = path.join(metaDataPath, fileName);
      log('[📝] Writing release notes to', notesPath);

      return mkdir(metaDataPath, { recursive: true })
        .then(() => writeFile(notesPath, releaseNotes));
    })]);
  }

  return Promise.all([
    writeNotes(path.join(androidPath, 'fastlane', 'metadata', 'android'), `${version}.txt`),
    writeNotes(path.join(iOSPath, 'fastlane', 'metadata'), 'release_notes.txt'),
  ]);
}
