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

    let data = await fsPromises.readFile(config.androidPath + '/app/build.gradle', 'utf8');

    expect(data.indexOf('versionCode 20203') > -1);
    expect(data.indexOf('versionName "2.2.3"') > -1);
    expect(result).toBe(undefined);
  });

  it('should correctly set the versions in plist', async () => {
    const result = await prepare(config, context);

    const data = await fsPromises.readFile(config.iosPath + '/ios_project/info.plist', 'utf8');

    const plistContents = plist.parse(data);

    expect(plistContents.CFBundleVersion === '2.2.3');
    expect(plistContents.CFBundleShortVersionString === '2.2.3');
    expect(result).toBe(undefined);
  })

  it('should correctly set the versions in gradle again', async () => {
    context.nextRelease!.version = '3.10.0';

    const result = await prepare(config, context);

    let data = await  fsPromises.readFile(config.androidPath + '/app/build.gradle', 'utf8');

    expect(data.indexOf('versionCode 31000') > -1);
    expect(data.indexOf('versionName "3.10.0"') > -1);
  });

  it('should correctly set the versions in plist', async () => {
    context.nextRelease!.version = '3.10.0';

    const data = await fsPromises.readFile(config.iosPath + '/ios_project/info.plist', 'utf8');

    const plistContents = plist.parse(data);
    expect(plistContents.CFBundleVersion === '3.10.0');
    expect(plistContents.CFBundleShortVersionString === '3.10.0');
  });
});
