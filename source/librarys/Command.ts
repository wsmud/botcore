import { basename, extname } from 'path';
import Permissions from './Permissions';
import { User } from '../types/User';
import { checkPermission } from './Util';
import { State } from '../types/State';

export interface CommandConfig {
  name?: string;
  command: (state: State) => (...args: any[]) => void;
  usage?: string;
  aliases?: string[];
  permission: number;
}

export default class Command {
  /** 命令目录 */
  public bundle: string;

  /** 命令名字 */
  public name: string;

  /** 命令文件名 */
  public file: string;

  /** 命令函数 */
  public func: (...args: any[]) => void;

  /** 使用方法 */
  public usage: string;

  /** 命令别名 */
  public aliases: string[];

  /** 执行命令所需权限 */
  public permission: number;

  constructor(bundle: string, file: string, fuc: (...args: any[]) => void, options: CommandConfig) {
    this.bundle = bundle;
    this.name = options.name || basename(file, extname(file));
    this.file = file;
    this.func = fuc;
    this.usage = options.usage || this.name;
    this.aliases = options.aliases || [];
    this.permission = options.permission || Permissions.USER;
  }

  /**
   * 用户执行命令
   * @param user
   * @param args 命令参数
   */
  public execute(user: User, args: string[]): void {
    if (
      !user.ban &&
      (user.extraCmd.includes(this.name) || checkPermission(user, this.permission))
    ) {
      this.func(user, args);
    }
  }
}
