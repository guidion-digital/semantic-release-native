import path from 'path';

import { updateGradleVersion } from '../src/android';
import { getVersionCode, readFile, writeFile } from '../src/utils';
import { gradleFixture, updatedGradleFixture } from './fixtures/gradleFixture';

const androidPath = __dirname + '/fixtures/android_project';

jest.mock('../src/utils', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  getVersionCode: jest.fn().mockReturnValue(20403),
}));

describe('android', () => {
  describe('updateGradleVersion', () => {
    it('should update versionCode and versionName in build.gradle', async () => {
      const savedSymbol = Symbol('saved');
      (readFile as jest.Mock).mockResolvedValue(gradleFixture);
      (writeFile as jest.Mock).mockResolvedValue(savedSymbol);

      const nextVersion = '2.4.3';

      const result = await updateGradleVersion(androidPath, nextVersion);

      expect(readFile).toHaveBeenCalledWith(path.join(androidPath, '/app/build.gradle'));
      expect(getVersionCode).toHaveBeenCalledWith(nextVersion);
      expect(writeFile).toHaveBeenCalledWith(
        path.join(androidPath, '/app/build.gradle'),
        updatedGradleFixture
      );
      expect(result).toBe(savedSymbol);
    });
  });
});
