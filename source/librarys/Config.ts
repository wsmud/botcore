import { parseFile } from './Util';

export interface BotConfig {
  [index: string]: string | number | string[];
  name: string;
  server: number;
  account: string;
  password: string;
}

export default class Config {
  private config: BotConfig;

  constructor(path: string) {
    this.config = parseFile<BotConfig>(path);
  }

  /**
   * 设置参数
   * @param key 参数名
   * @param value 参数值
   */
  public set(key: string, value: string | number | string[]) {
    this.config[key] = value;
  }

  /**
   * 获取参数值
   * @param key 参数名
   * @param fallback 获取失败时返回的值
   * @returns
   */
  public get(
    key: string,
    fallback?: string | number | string[],
  ): string | number | string[] | undefined {
    return this.has(key) ? this.config[key] : fallback;
  }

  /**
   * 检查配置是否有某参数
   * @param 参数名
   * @returns
   */
  public has(key: string): boolean {
    return key in this.config;
  }
}
