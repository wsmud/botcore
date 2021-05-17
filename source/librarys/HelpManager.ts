import Help from './Help';

export default class HelpManager {
  /** 帮助列表 */
  private helps: Map<string, Help>;

  constructor() {
    this.helps = new Map();
  }

  /**
   * 添加帮助
   * @param help
   */
  public add(help: Help): void {
    this.helps.set(help.name, help);
  }

  /**
   * 通过名字获取帮助信息
   * @param helpName
   * @returns 获取到的帮助信息或undefined
   */
  public get(helpName: string): Help | undefined {
    return this.helps.get(helpName);
  }

  /**
   * 通过名字获取是否有某个帮助
   * @helpName
   * @returns
   */
  public has(helpName: string): boolean {
    return this.helps.has(helpName);
  }

  /**
   * 通过名字删除某个帮助
   * @param helpName
   */
  public remove(helpName: string): void {
    this.helps.delete(helpName);
  }
}
