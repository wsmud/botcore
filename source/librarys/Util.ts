/* eslint no-bitwise: ['error', { 'allow': ['&', '|=', '^='] }] */

import axios from 'axios';
import { stringify } from 'qs';
import { extname, resolve } from 'path';
import { load } from 'js-yaml';
import { parse } from 'json5';
import { statSync, readFileSync, existsSync } from 'fs';
import { User } from '../types/User';
import { Server, Servers } from '../types/Server';

/**
 * 检查路径是否为js文件
 * @param path
 * @returns
 */
export function isScriptFile(path: string): boolean {
  return statSync(path).isFile() && extname(path) === '.js';
}

/**
 * 检查传入的参数是否可迭代
 * @param arg
 * @returns
 */
export function isIterable(arg: any): boolean {
  return arg && typeof arg[Symbol.iterator] === 'function';
}

/**
 * 检查用户权限
 * @param user
 * @param permission 目标检查权限
 * @returns
 */
export function checkPermission(user: User, permission: number): boolean {
  return (user.permission & permission) === permission;
}

/**
 * 赋予用户权限
 * @param user
 * @param permission 目标赋予权限
 */
export function addPermission(user: User, permission: number): void {
  const copyUser: User = user;
  copyUser.permission |= permission;
}

/**
 * 删除用户权限
 * @param user
 * @param permission 目标删除权限
 */
export function removePermission(user: User, permission: number): void {
  const copyUser: User = user;
  copyUser.permission ^= permission;
}

/**
 * 获取websocket地址
 * @param serverNum 服务器序号
 * @throws 获取服务器信息失败时
 * @returns websocket地址
 */
export async function getServer(serverNum: number): Promise<string> {
  const response = await axios.get('http://game.wsmud.com/Game/GetServer');
  if (response.status !== 200 || serverNum < 0 || serverNum >= response.data.length) {
    throw new Error('获取服务器信息失败。');
  }
  const servers: Servers = response.data;
  const serverInfo: Server = servers[serverNum - 1];
  return `ws://${serverInfo.IP}:${serverInfo.Port}`;
}

/**
 * 获取用户登陆凭证
 * @param account 账号
 * @param password 密码
 * @throws 获取用户登陆凭证失败时
 * @returns 用户登陆凭证
 */
export async function getToken(account: string, password: string): Promise<string> {
  const response = await axios.post(
    'http://game.wsmud.com/UserApi/Login',
    stringify({ code: account, pwd: password }),
  );
  if (response.status !== 200 || !response.headers['set-cookie']) {
    throw new Error('获取用户登陆凭证失败。');
  }
  const token: string[] = response.headers['set-cookie'].map((cookie: string) => {
    const cookieMatch: string[] | null = cookie.match(/^[up]=(.+?);/);
    return cookieMatch ? cookieMatch[1] : '';
  });
  return token.join(' ');
}

/**
 * 解析文件
 * @param path 文件路径
 * @throws 未找到文件时
 * @throws 文件类型错误时
 * @returns 文件信息
 */
export function parseFile<T>(path: string): T {
  if (!existsSync(path)) {
    throw new Error(`未找到「${path}」这个文件。`);
  }
  const ext: string = extname(path);
  const file: string = readFileSync(resolve(path)).toString();
  let data: any;
  switch (ext) {
    case '.json':
      data = parse(file);
      break;
    case '.yml':
    case '.yaml':
      data = load(file);
      break;
    default:
      throw new TypeError(`「${ext}」为不受支持的文件类型。`);
  }

  return data;
}
