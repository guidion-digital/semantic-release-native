import fsPromises from 'fs/promises';
import plist from 'plist';

import { prepare } from '../src';
import { Context } from '../src/interfaces';

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

  it('should correctly set the versions in gradle', async () => {
    const result = await prepare(config, context);

    const data = await fsPromises.readFile(config.androidPath + '/app/build.gradle', 'utf8');

    expect(data.includes('versionCode 20203')).toBe(true);
    expect(data.includes('versionName "2.2.3"')).toBe(true);
    expect(result).toBe(undefined);
  });

  it('should correctly set the versions in plist', async () => {
    const result = await prepare(config, context);

    const data = await fsPromises.readFile(config.iosPath + '/ios_project/info.plist', 'utf8');

    const plistContents = plist.parse(data);

    expect(plistContents.CFBundleVersion).toBe('2.2.3');
    expect(plistContents.CFBundleShortVersionString).toBe('2.2.3');
    expect(result).toBe(undefined);
  });

  it('should correctly set the versions in gradle again', async () => {
    context.nextRelease!.version = '3.10.0';

    await prepare(config, context);

    const data = await fsPromises.readFile(config.androidPath + '/app/build.gradle', 'utf8');

    expect(data.includes('versionCode 31000')).toBe(true);
    expect(data.includes('versionName "3.10.0"')).toBe(true);
  });

  it('should correctly set the versions in plist again', async () => {
    context.nextRelease!.version = '3.10.0';

    const data = await fsPromises.readFile(config.iosPath + '/ios_project/info.plist', 'utf8');

    const plistContents = plist.parse(data);
    expect(plistContents.CFBundleVersion).toBe('3.10.0');
    expect(plistContents.CFBundleShortVersionString).toBe('3.10.0');
  });
});
