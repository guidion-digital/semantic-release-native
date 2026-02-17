import { mkdir } from 'fs/promises';

import { writeNotesToFastlane } from '../src/fastlane';
import { writeFile } from '../src/utils';

const config = {
  androidPath: __dirname + '/fixtures/android_project',
  iosPath: __dirname + '/fixtures'
};

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
}));
jest.mock('../src/utils', () => ({
  writeFile: jest.fn(),
}));

describe('fastlane', () => {
  it('should write release notes to fastlane to android', async () => {
    (mkdir as jest.Mock).mockResolvedValue(undefined);
    (writeFile as jest.Mock).mockResolvedValue(undefined);
    const mockLog = jest.fn();

    await writeNotesToFastlane(
      config.androidPath,
      config.iosPath,
      ['en'],
      31000,
      'Release notes',
      mockLog
    );

    // android
    expect(mkdir).toHaveBeenCalledWith(config.androidPath + '/fastlane/metadata/android/en/changelogs', { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(
      config.androidPath + '/fastlane/metadata/android/en/changelogs/31000.txt', 'Release notes'
    );
  });

  it('should write release notes to fastlane to ios', async () => {
    (mkdir as jest.Mock).mockResolvedValue(undefined);
    (writeFile as jest.Mock).mockResolvedValue(undefined);
    const mockLog = jest.fn();

    await writeNotesToFastlane(
      config.androidPath,
      config.iosPath,
      ['en'],
      31000,
      'Release notes',
      mockLog
    );

    // ios
    expect(mkdir).toHaveBeenCalledWith(config.iosPath + '/fastlane/metadata/en', { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(config.iosPath + '/fastlane/metadata/en/release_notes.txt', 'Release notes');
  });

  it('should write for multiple languages', async () => {
    (mkdir as jest.Mock).mockResolvedValue(undefined);
    (writeFile as jest.Mock).mockResolvedValue(undefined);
    const mockLog = jest.fn();

    await writeNotesToFastlane(
      config.androidPath,
      config.iosPath,
      ['en', 'de'],
      31000,
      'Release notes',
      mockLog
    );

    // android
    expect(mkdir).toHaveBeenCalledWith(config.androidPath + '/fastlane/metadata/android/en/changelogs', { recursive: true });
    expect(mkdir).toHaveBeenCalledWith(config.androidPath + '/fastlane/metadata/android/de/changelogs', { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(
      config.androidPath + '/fastlane/metadata/android/en/changelogs/31000.txt', 'Release notes'
    );
    expect(writeFile).toHaveBeenCalledWith(
      config.androidPath + '/fastlane/metadata/android/de/changelogs/31000.txt', 'Release notes'
    );

    // ios
    expect(mkdir).toHaveBeenCalledWith(config.iosPath + '/fastlane/metadata/en', { recursive: true });
    expect(mkdir).toHaveBeenCalledWith(config.iosPath + '/fastlane/metadata/de', { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(config.iosPath + '/fastlane/metadata/en/release_notes.txt', 'Release notes');
    expect(writeFile).toHaveBeenCalledWith(config.iosPath + '/fastlane/metadata/de/release_notes.txt', 'Release notes');
  });

  it('should shrink release notes if they exceed RELEASE_NOTES_MAX_LENGTH', async () => {
    (mkdir as jest.Mock).mockResolvedValue(undefined);
    (writeFile as jest.Mock).mockResolvedValue(undefined);
    const mockLog = jest.fn();

    const longReleaseNotes = 'a'.repeat(500);
    const expectedShrunkNotes = 'a'.repeat(495) + '...';

    await writeNotesToFastlane(
      config.androidPath,
      config.iosPath,
      ['en'],
      31000,
      longReleaseNotes,
      mockLog
    );

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('31000.txt'),
      expectedShrunkNotes
    );
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('release_notes.txt'),
      expectedShrunkNotes
    );
  });
});
