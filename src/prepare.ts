import { SemanticMethod, Config } from './interfaces';

import SemanticReleaseError from '@semantic-release/error';
import { updateGradleVersion } from './android';
import { updatePlist } from './ios';
import { writeNotesToFastlane } from './fastlane';
import { getVersionCode } from './utils';

/**
 * Prepare the new release by updating gradle and plist.
 * This should update at least the `version` using the next release version name.
 * It should also update the version code and build number when available.
 */
const prepare: SemanticMethod = async (config, context) => {
  if (!context.nextRelease) {
    throw new Error('No next release found');
  }

  const androidPath = config.androidPath || './android';
  const iosPath = config.iosPath || './ios';

  const versionCode = getVersionCode(context.nextRelease.version);

  const androidWork = updateGradleVersion(androidPath, context.nextRelease.version);

  const iosWork = updatePlist(iosPath, context.nextRelease.version);

  const promises = [androidWork, iosWork];

  if (config.isFastlane && config.fastlaneReleaseNoteLanguages) {
    promises.push(writeNotesToFastlane(iosPath, 'ios', config.fastlaneReleaseNoteLanguages, versionCode, context.nextRelease.notes, context.logger.log));
    promises.push(writeNotesToFastlane(androidPath, 'android', config.fastlaneReleaseNoteLanguages, versionCode, context.nextRelease.notes, context.logger.log));
  }

  return Promise.all(promises).then(() => {
    context.logger.log(' Updated all files!');
  }).catch(error => {
    throw new SemanticReleaseError(
      'Could not write new versions for all files',
      'EWRITEVERSION',
      error,
    );
  });
};


export default prepare;
