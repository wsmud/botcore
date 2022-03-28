import WebSocket from 'ws';
import { parse } from 'json5';
import { EventEmitter } from 'events';
import { Message } from '../types/Message';

export default class Socket extends EventEmitter {
  /** websocket */
  private socket: WebSocket;

  constructor(wsUrl: string, token: string) {
    super();
    this.socket = new WebSocket(wsUrl, {
      origin: 'http://game.wsmud.com',
    });

    this.socket.onopen = () => {
      this.emit('_open');
      /** 发送用户登陆凭证 */
      this.socket.send(token);
    };

    this.socket.onclose = () => {
      this.emit('_close');
    };

    this.socket.onerror = (error: WebSocket.ErrorEvent) => {
      this.emit('_error', error);
    };

    this.socket.onmessage = (message: WebSocket.MessageEvent) => {
      if (typeof message.data === 'string') {
        try {
          const data: Message = /^{.*}$/.test(message.data)
            ? parse(message.data)
            : { type: 'tip', message: message.data };
          this.emit(data.type, data);
        } catch (error: any) {
          this.emit('_error', error);
        }
      }
    };
  }

  /**
   * 获取当前websocket是否已连接
   * @returns
   */
  public get writable(): boolean {
    return this.socket.readyState === 1;
  }

  /**
   * 发送消息
   * @param message
   */
  public send(message: string): void {
    if (this.socket.readyState !== 1) {
      return;
    }

    const cmdList: string[] = message.split(',');
    cmdList.forEach((cmd: string) => this.socket.send(cmd));
  }

  /**
   * 关闭websocket连接
   */
  public close(): void {
    this.socket.close(1000);
  }
}
