import type Socket from '../librarys/Socket';
import type Config from '../librarys/Config';
import type Logger from '../librarys/Logger';
import type DataBase from '../librarys/DataBase';
import type HelpManager from '../librarys/HelpManager';
import type EventManager from '../librarys/EventManager';
import type CommandManager from '../librarys/CommandManager';

export interface State {
  Socket: Socket;
  Config: Config;
  Logger: Logger;
  DataBase: DataBase;
  HelpManager: HelpManager;
  EventManager: EventManager;
  CommandManager: CommandManager;
}
