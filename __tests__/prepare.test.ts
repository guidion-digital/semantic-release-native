import { prepare } from '../src';
import { Context } from '../src/interfaces';
import { getVersionCode } from '../src/utils';
import { updatePlist } from '../src/ios';
import { updateGradleVersion } from '../src/android';
import { writeNotesToFastlane } from '../src/fastlane';


jest.mock('../src/android', () => ({
  updateGradleVersion: jest.fn(),
}));
jest.mock('../src/ios', () => ({
  updatePlist: jest.fn(),
}));
jest.mock('../src/fastlane', () => ({
  writeNotesToFastlane: jest.fn(),
}));
jest.mock('../src/utils', () => ({
  getVersionCode: jest.fn().mockReturnValue(20203),
}));

const context: Context = {
  logger: {
    log: () => true,
    error: () => true,
  },
  nextRelease: { version: '2.2.3', gitHead: 'bla', gitTag: '', notes: 'super cool release!' }
};
const config = { androidPath: __dirname + '/fixtures/android_project', iosPath: __dirname + '/fixtures' };

describe('prepare', () => {
  beforeAll(() => {
    console.log = jest.fn();
  });

  beforeEach(async () => {
    context.nextRelease!.version = '2.2.3';
  });

  it('should correctly set the versions', async () => {
    const result = await prepare(config, context);

    expect(getVersionCode).toHaveBeenCalledWith('2.2.3');
    expect(updateGradleVersion).toHaveBeenCalledWith(config.androidPath, '2.2.3');
    expect(updatePlist).toHaveBeenCalledWith(config.iosPath, '2.2.3');

    expect(result).toBe(undefined);
  });

  it('should correctly set the versions with fastlane', async () => {
    const result = await prepare(
      { ...config, isFastlane: true, fastlaneReleaseNoteLanguages: ['en'] },
      context
    );

    expect(getVersionCode).toHaveBeenCalledWith('2.2.3');
    expect(updateGradleVersion).toHaveBeenCalledWith(config.androidPath, '2.2.3');
    expect(updatePlist).toHaveBeenCalledWith(config.iosPath, '2.2.3');
    expect(writeNotesToFastlane).toHaveBeenCalledWith(
      config.androidPath,
      config.iosPath,
      ['en'],
      20203,
      'super cool release!',
      context.logger.log
    );

    expect(result).toBe(undefined);
  });
});
