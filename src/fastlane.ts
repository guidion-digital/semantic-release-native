import path from 'path';
import { writeFile } from './utils';
import { mkdir } from 'fs/promises';
import { Context } from './interfaces';

export const writeNotesToFastlane = async (androidPath: string, iOSPath: string, languages: string[],
  version: number, releaseNotes: string, log: Context['logger']['log']) => {
  const RELEASE_NOTES_MAX_LENGTH = 495; // Play store max length is 500

  const safeReleaseNotes = releaseNotes.length > RELEASE_NOTES_MAX_LENGTH
    ? releaseNotes.slice(0, RELEASE_NOTES_MAX_LENGTH) + '...'
    : releaseNotes;

  const writeNotes = (osPath: string, fileName: string, changeLogsPath?: string) => {
    return Promise.all([languages.map(async language => {
      const paths = [osPath, language];

      if (changeLogsPath) {
        paths.push(changeLogsPath);
      }

      const metaDataPath = path.join(...paths);

      const notesPath = path.join(metaDataPath, fileName);
      log('[📝] Writing release notes to', notesPath);

      return mkdir(metaDataPath, { recursive: true })
        .then(() => writeFile(notesPath, safeReleaseNotes));
    })]);
  };

  return Promise.all([
    writeNotes(path.join(androidPath, 'fastlane', 'metadata', 'android'), `${version}.txt`, 'changelogs'),
    writeNotes(path.join(iOSPath, 'fastlane', 'metadata'), 'release_notes.txt'),
  ]);
};
