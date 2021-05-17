import Sqlite3 from 'better-sqlite3';
import { existsSync, statSync, mkdirSync } from 'fs';
import { parse, stringify } from 'json5';
import { resolve } from 'path';
import { MessageRecord } from '../types/Message';
import { User } from '../types/User';

export default class DataBase {
  /** 数据库文件名 */
  public dataBaseName: string;

  /** 数据库目录 */
  public dataBasePath: string;

  /** 数据库主体 */
  private dataBase: Sqlite3.Database;

  constructor(dbPath?: string, dbName?: string) {
    this.dataBaseName = dbName || 'database';
    this.dataBasePath = resolve(dbPath || 'data');
    if (!existsSync(this.dataBasePath)) {
      mkdirSync(this.dataBasePath);
    } else if (statSync(this.dataBasePath).isFile()) {
      throw new Error(`数据库目录已被文件占有。`);
    }
    this.dataBase = new Sqlite3(resolve(this.dataBasePath, this.dataBaseName), {
      timeout: 3e4,
    });
    this.init();
  }

  /**
   * 初始化数据库
   */
  private init() {
    this.dataBase
      .prepare(
        `CREATE TABLE IF NOT EXISTS bot(
      type TEXT NOT NULL PRIMARY KEY,
      data TEXT NOT NULL DEFAULT '{}'
    )`,
      )
      .run();
    this.dataBase
      .prepare(
        `CREATE TABLE IF NOT EXISTS user(
      id TEXT NOT NULL PRIMARY KEY,
      permission INT NOT NULL DEFAULT 1,
      ban BOOLEAN DEFAULT 0,
      extraCmd TEXT DEFAULT '[]'
    )`,
      )
      .run();
    this.dataBase
      .prepare(
        `CREATE TABLE IF NOT EXISTS msg(
      type TEXT NOT NULL,
      id TEXT,
      name TEXT,
      message TEXT NOT NULL,
      time TIMESTAMP NOT NULL DEFAULT (strftime('%s', 'now'))
    )`,
      )
      .run();
  }

  /**
   * 获取用户信息
   * @param id 用户id
   * @returns
   */
  public getUserInfo(id: string): User {
    const stmt = this.dataBase.prepare('SELECT * FROM user WHERE id = ?');
    return parse(stmt.get(id));
  }

  /**
   * 设置用户信息
   * @param id 用户id
   * @param options 用户设置信息
   * @returns 设置结果
   */
  public setUserInfo(id: string, { permission, ban, extraCmd }: User): Sqlite3.RunResult {
    const stmt = this.dataBase.prepare(
      'REPLACE INTO user(id, role, ban, extraCmd) VALUES(?, ?, ?, ?)',
    );
    return stmt.run(id, permission, ban, extraCmd);
  }

  /**
   * 获取机器人数据
   * @param type 数据类型
   * @returns
   */
  public getBotData(type: string): object {
    const stmt = this.dataBase.prepare('SELECT * FROM bot WHERE type = ?');
    return parse(stmt.get(type));
  }

  /**
   * 存储机器人数据
   * @param type 类型
   * @param data 数据
   * @returns 存储结果
   */
  public setBotData(type: string, data: object): Sqlite3.RunResult {
    const stmt = this.dataBase.prepare('REPLACE INTO bot(type, data) VALUES(?, ?)');
    return stmt.run(type, stringify(data));
  }

  /**
   * 根据id获取最后指定数量发言
   * @param id 用户id
   * @param limit 获取数量
   * @returns 发言记录
   */
  public getLastMsgById(id: string, limit: number = 1): MessageRecord[] {
    const stmt = this.dataBase.prepare(
      `SELECT * FROM msg WHERE id = ? ORDER BY time DESC LIMIT 0,${limit}`,
    );
    return stmt.all(id);
  }

  /**
   * 根据名字获取最后指定数量发言
   * @param name 用户名字
   * @param limit 获取数量
   * @returns 发言记录
   */
  public getLastMsgByName(name: string, limit: number = 1): MessageRecord[] {
    const stmt = this.dataBase.prepare(
      `SELECT * FROM msg WHERE name = ? ORDER BY time DESC LIMIT 0,${limit}`,
    );
    return stmt.all(name);
  }

  /**
   * 根据发言类型获取最后指定数量发言
   * @param type 发言类型
   * @param limit 获取数量
   * @returns 发言记录
   */
  public getLastMsgByType(type: string, limit: number = 1): MessageRecord[] {
    const stmt = this.dataBase.prepare(
      `SELECT * FROM msg WHERE type = ? ORDER BY time DESC LIMIT 0,${limit}`,
    );
    return stmt.all(type);
  }

  /**
   * 通过id获取单个用户的所有发言记录
   * @param id 用户id
   * @returns 发言记录
   */
  public getAllMsgById(id: string): MessageRecord[] {
    const stmt = this.dataBase.prepare('SELECT * FROM msg WHERE id = ? ORDER BY time');
    return stmt.all(id);
  }

  /**
   * 通过名字获取单个用户的所有发言记录
   * @param name 用户名字
   * @returns 发言记录
   */
  public getAllMsgByName(name: string): MessageRecord[] {
    const stmt = this.dataBase.prepare('SELECT * FROM msg WHERE name = ? ORDER BY time');
    return stmt.all(name);
  }

  /**
   * 存储用户发言
   * @param type 发言类型
   * @param id 用户id
   * @param name 用户名字
   * @param mag 发言内容
   */
  public setMsg({ type, id, name, message }: MessageRecord) {
    const stmt = this.dataBase.prepare(
      'INSERT INTO msg(type, id, name, message) VALUES(?, ?, ?, ?)',
    );
    return stmt.run(type, id, name, message);
  }
}
