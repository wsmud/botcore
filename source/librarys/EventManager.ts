import Event from './Event';
import Logger from './Logger';
import Socket from './Socket';

const logger: Logger = new Logger('Event');

export default class EventManager {
  private events: Map<string, Event> = new Map();

  private emitter: Socket;

  constructor(socket: Socket) {
    this.emitter = socket;
  }

  /**
   * 添加事件
   * @param event
   */
  public add(event: Event): void {
    if (this.has(event.name)) {
      logger.error(`事件[${event.name}]已存在，添加失败。`);
    } else {
      this.events.set(event.name, event);
    }
  }

  /**
   * 通过名字获取事件
   * @param eventName
   * @returns
   */
  public get(eventName: string): Event | undefined {
    return this.events.get(eventName);
  }

  /**
   * 通过名字判断事件是否存在
   * @param eventName
   * @returnse
   */
  public has(eventName: string): boolean {
    return this.events.has(eventName);
  }

  /**
   * 通过名字删除事件
   * @param eventName
   * @returnse
   */
  public remove(eventName: string) {
    this.events.delete(eventName);
  }

  /**
   * 将当前事件列全部绑定至派发器上
   * @param event
   */
  public attach(event: Event): void {
    if (this.has(event.name)) {
      this.emitter.on(event.event, event.listener);
    } else {
      logger.error(`事件[${event.name}]已存在，绑定失败。`);
    }
  }

  /**
   * 根据名字分离派发器中的某个监听器
   * @param eventName
   */
  public detach(eventName: string): void {
    const event: Event | undefined = this.get(eventName);
    if (event) {
      this.emitter.removeListener(event.event, event.listener);
    } else {
      logger.error(`未找到[${eventName}]事件，分离失败。`);
    }
  }

  /**
   * 将当前事件列表绑定至派发器上
   */
  public attachAll(): void {
    this.events.forEach((event) => {
      this.emitter.on(event.event, event.listener);
    });
  }

  /**
   * 删除派发器中的全部监听器
   */
  public detachAll(): void {
    this.emitter.removeAllListeners();
    logger.warn(`已移除全部监听器。`);
  }
}
