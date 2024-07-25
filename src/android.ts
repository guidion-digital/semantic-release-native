import path from 'path';

import { getVersionCode, readFile, writeFile } from './utils';

export const updateGradleVersion = async (androidPath: string, nextVersion: string) => {
  const gradlePath = path.join(androidPath, '/app/build.gradle');
  const contents = await readFile(gradlePath);
  const nextVersionCode = getVersionCode(nextVersion);
  const withUpgradedVersionCode = contents.replace(/((versionCode \d+){1})/g, 'versionCode ' + nextVersionCode);
  const withUpgradedCodeAndName = withUpgradedVersionCode.replace(/((versionName ".*"){1})/g, 'versionName "' + nextVersion + '"');
  return writeFile(gradlePath, withUpgradedCodeAndName);
}
