import Command from './Command';
import Logger from './Logger';

const logger: Logger = new Logger('Command');

export default class CommandManager {
  /** 命令列表 */
  private commands: Map<string, Command>;

  constructor() {
    this.commands = new Map();
  }

  /**
   * 添加命令
   * @param command
   */
  public add(command: Command): void {
    if (!this.has(command.name)) {
      this.commands.set(command.name, command);
    } else {
      logger.error(`命令[${command.name}]已存在，添加失败。`);
    }
  }

  /**
   * 通过命令名字获取命令
   * @param commandName 命令名字
   * @returns 获取到的命令或undefined
   */
  public get(commandName: string): Command | undefined {
    return this.commands.get(commandName);
  }

  /**
   * 通过名字获取是否有某个命令
   * @commandName
   * @returns
   */
  public has(commandName: string): boolean {
    return this.commands.has(commandName);
  }

  /**
   * 通过命令名字删除某个命令
   * @param commandName
   */
  public remove(commandName: string): void {
    this.commands.delete(commandName);
  }
}
