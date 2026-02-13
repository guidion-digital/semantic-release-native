import plist from 'plist';

import { updatePlist } from '../src/ios';
import { readDir, readFile, writeFile } from '../src/utils';


jest.mock('../src/utils', () => ({
  writeFile: jest.fn(),
  readDir: jest.fn(),
  readFile: jest.fn(),
}));
jest.mock('fs', () => ({
  statSync: jest.fn().mockReturnValue({ isDirectory: () => true }),
}));
jest.mock('plist', () => ({
  parse: jest.fn().mockReturnValue({ CFBundleVersion: '1.0.0', CFBundleShortVersionString: '1.0.0' }),
  build: jest.fn().mockReturnValue('built-plist'),
}));

const config = {
  iosPath: __dirname + '/fixtures/ios_project',
};

describe('ios', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  describe('updatePlist', () => {
    it('should update the plist file', async () => {
      (readDir as jest.Mock).mockResolvedValue(['ios_project']);
      (readFile as jest.Mock).mockResolvedValue('filedata');
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await updatePlist(config.iosPath, '3.10.0');

      expect(readDir).toHaveBeenCalledWith(config.iosPath);
      expect(readFile).toHaveBeenCalledWith(config.iosPath + '/ios_project/Info.plist');
      expect(plist.parse).toHaveBeenCalledWith('filedata');
      expect(plist.build).toHaveBeenCalledWith({ CFBundleVersion: '3.10.0', CFBundleShortVersionString: '3.10.0' });
      expect(writeFile).toHaveBeenCalledWith(config.iosPath + '/ios_project/Info.plist', 'built-plist');
    });
  });
});
