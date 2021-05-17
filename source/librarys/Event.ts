import { basename, extname } from 'path';
import { State } from '../types/State';

export interface EventConfig {
  name: string;
  event: string;
  listener: (state: State) => (...args: any[]) => void;
}

export default class Event {
  /** 事件文件路径 */
  public file?: string;

  /** 事件名字 */
  public name: string;

  /** 事件触发 */
  public event: string;

  /** 事件所属包名 */
  public bundle: string;

  /** 事件监听器 */
  public listener: (...args: any[]) => void;

  constructor(
    bundle: string,
    file: string,
    listener: (...args: any[]) => void,
    options: EventConfig,
  ) {
    this.file = file;
    this.bundle = bundle;
    this.name = options.name || basename(file, extname(file));
    this.event = options.event || this.name;
    this.listener = listener;
  }
}
