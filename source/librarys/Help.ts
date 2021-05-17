import { basename, extname } from 'path';

export interface HelpConfig {
  name?: string;
  keywords?: string[];
  command: string;
  body: string;
}

export default class Help {
  /** 所属包名 */
  public bundle: string;

  /** 帮助名称 */
  public name: string;

  /** 帮助关键字 */
  public keywords: string[];

  /** 帮助文件 */
  public file: string;

  /** 帮助所属命令 */
  public command?: string;

  /** 帮助内容 */
  public body: string;

  constructor(bundle: string, file: string, options: HelpConfig) {
    this.bundle = bundle;
    this.name = options.name || basename(file, extname(file));
    this.file = file;
    this.keywords = options.keywords || [this.name];
    this.command = options.command;
    this.body = options.body;
  }
}
