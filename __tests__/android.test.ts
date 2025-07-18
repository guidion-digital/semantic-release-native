import fsPromises from 'fs/promises';
import path from 'path';

import { updateGradleVersion } from '../src/android';
import { getVersionCode } from '../src/utils';

const androidPath = __dirname + '/fixtures/android_project';

describe('android', () => {
  let originalGradleContent: string;

  beforeAll(async () => {
    // Store original content to restore after tests
    originalGradleContent = await fsPromises.readFile(path.join(androidPath, '/app/build.gradle'), 'utf8');
  });

  afterEach(async () => {
    // Restore original content after each test
    await fsPromises.writeFile(path.join(androidPath, '/app/build.gradle'), originalGradleContent);
  });

  describe('updateGradleVersion', () => {
    it('should update versionCode and versionName in build.gradle', async () => {
      const nextVersion = '2.4.3';
      const expectedVersionCode = getVersionCode(nextVersion);

      const result = await updateGradleVersion(androidPath, nextVersion);

      const updatedContent = await fsPromises.readFile(path.join(androidPath, '/app/build.gradle'), 'utf8');

      expect(updatedContent).toContain(`versionCode ${expectedVersionCode}`);
      expect(updatedContent).toContain(`versionName "${nextVersion}"`);
      expect(result).toBe('saved: ' + path.join(androidPath, '/app/build.gradle'));
    });
  });
});
