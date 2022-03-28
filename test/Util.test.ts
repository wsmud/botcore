import * as Util from '../source/librarys/Util';
import { User } from '../source/types/User';
import Permissions from '../source/librarys/Permissions';

const testUser: User = {
  id: 'testId',
  ban: false,
  extraCmd: [],
  permission: Permissions.USER,
};

describe('Util', () => {
  test('isIterable', () => {
    expect(Util.isIterable([])).not.toBeFalsy();
  });

  test('isScriptFile', () => {
    expect(Util.isScriptFile('source/index.ts')).toBeFalsy();
  });

  test('getToken', async () => {
    const token = await Util.getToken('testaccount', 'testpassword');
    expect(token).not.toBeNull();
  });

  test('getServer', async () => {
    const token = await Util.getServer(1);
    expect(token).not.toBeNull();
  });

  test('parseFile', () => {
    expect(Util.parseFile('package.json')).toMatchObject({ name: '@wsmud/botcore' });
  });

  test('checkPermission', () => {
    expect(Util.checkPermission(testUser, Permissions.USER)).not.toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ADMIN)).toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ROOT)).toBeFalsy();
  });

  test('addPermission', () => {
    Util.addPermission(testUser, Permissions.ROOT);
    expect(Util.checkPermission(testUser, Permissions.USER)).not.toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ADMIN)).toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ROOT)).not.toBeFalsy();
    Util.addPermission(testUser, Permissions.ADMIN);
    expect(Util.checkPermission(testUser, Permissions.USER)).not.toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ADMIN)).not.toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ROOT)).not.toBeFalsy();
  });

  test('removePermission', () => {
    Util.removePermission(testUser, Permissions.ROOT);
    expect(Util.checkPermission(testUser, Permissions.USER)).not.toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ADMIN)).not.toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ROOT)).toBeFalsy();
    Util.removePermission(testUser, Permissions.ADMIN);
    expect(Util.checkPermission(testUser, Permissions.USER)).not.toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ADMIN)).toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ROOT)).toBeFalsy();
    Util.removePermission(testUser, Permissions.USER);
    expect(Util.checkPermission(testUser, Permissions.USER)).toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ADMIN)).toBeFalsy();
    expect(Util.checkPermission(testUser, Permissions.ROOT)).toBeFalsy();
  });
});
