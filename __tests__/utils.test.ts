import fs from 'fs';

import { readFile, writeFile, readDir, getVersionCode } from '../src/utils';

jest.mock('fs', () => ({
  readFile: jest.fn().mockImplementation((_, __, fn) => {
    fn(null, 'file');
  }),
  writeFile: jest.fn().mockImplementation((_, __, fn) => {
    fn(null);
  }),
  readdir: jest.fn().mockImplementation((_, fn) => {
    fn(null, ['dir']);
  }),
}));
describe('utils', () => {
  describe('readFile', () => {
    it('should promisify fs readFile', async () => {
      const result = await readFile('test.txt');

      expect(fs.readFile).toHaveBeenCalledWith('test.txt', 'utf8', expect.any(Function));
      expect(result).toBe('file');
    });
  });

  describe('writeFile', () => {
    it('should promisify fs writeFile', async () => {
      const result = await writeFile('test.txt', 'file');

      expect(fs.writeFile).toHaveBeenCalledWith('test.txt', 'file', expect.any(Function));
      expect(result).toBe('saved: test.txt');
    });
  });

  describe('readDir', () => {
    it('should promisify fs readdir', async () => {
      const result = await readDir('test.txt');

      expect(fs.readdir).toHaveBeenCalledWith('test.txt', expect.any(Function));
      expect(result).toEqual(['dir']);
    });
  });

  describe('getVersionCode', () => {
    it('should return the version code', () => {
      const result = getVersionCode('1.0.0');

      expect(result).toBe(10000);
    });
  });
});
