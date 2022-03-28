/* eslint 'global-require': 'off' */
/* eslint 'import/no-dynamic-require': 'off' */

import { existsSync, readdirSync, statSync } from 'fs';
import { extname, resolve } from 'path';
import Help, { HelpConfig } from './Help';
import Event, { EventConfig } from './Event';
import Command, { CommandConfig } from './Command';
import { parseFile, isScriptFile } from './Util';
import { State } from '../types/State';
import Logger from './Logger';

const logger: Logger = new Logger('Bundle');
let bundlesPath: string;
let botState: State;

/**
 * 生成帮助
 * @param helpPath 帮助文件路径
 * @param bundle 帮助所属包
 * @returns
 */
export function createHelp(helpPath: string, bundle: string): Help | undefined {
  try {
    const helpImport: HelpConfig = parseFile<HelpConfig>(helpPath);
    if (!helpImport || !helpImport.body) {
      throw new Error(`帮助[${helpPath}]没有内容。`);
    }

    return new Help(bundle, helpPath, helpImport);
  } catch (error) {
    logger.error(`加载事件[${helpPath}]错误：${error}`);
    return undefined;
  }
}

/**
 * 加载帮助
 * @param bundle 所属的包名
 * @param helpsDirPath 帮助文件夹路径
 */
export function loadHelps(bundle: string, helpsDirPath: string): void {
  logger.verbose(`开始加载[${bundle}]下的帮助文件。`);
  const files: string[] = readdirSync(helpsDirPath);

  files.forEach((helpFile: string) => {
    const ext: string = extname(helpFile);
    if (/^\.json|y[a]{0,1}ml$/.test(ext)) {
      const helpPath: string = resolve(helpsDirPath, helpFile);
      const help: Help | undefined = createHelp(helpPath, bundle);
      if (help) {
        botState.HelpManager.add(help);
      }
    }
  });
  logger.verbose(`[${bundle}]下的帮助文件加载完毕。`);
}

/**
 * 生成事件
 * @param evevtPath 事件文件路径
 * @param bundle 事件所属包
 * @returns
 */
export function createEvent(eventPath: string, bundle: string): Event | undefined {
  try {
    const eventImport: EventConfig = require(eventPath);

    return new Event(bundle, eventPath, eventImport.listener(botState), eventImport);
  } catch (error) {
    logger.error(`加载事件[${eventPath}]错误：${error}`);
    return undefined;
  }
}

/**
 * 加载事件
 * @param bundle 所属的包名
 * @eventsDirPath 事件文件夹路径
 */
function loadEvents(bundle: string, eventsDirPath: string): void {
  logger.verbose(`开始加载[${bundle}]下的事件文件。`);
  const files: string[] = readdirSync(eventsDirPath);

  files.forEach((eventFile: string) => {
    const eventPath: string = resolve(eventsDirPath, eventFile);
    if (isScriptFile(eventPath)) {
      const event: Event | undefined = createEvent(eventPath, bundle);
      if (event) {
        botState.EventManager.add(event);
      }
    }
  });
  logger.verbose(`[${bundle}]下的事件文件加载完毕。`);
}

/**
 * 生成命令
 * @param commandPath 命令文件路径
 * @param bundle 命令所属包
 * @returns
 */
export function createCommand(commandPath: string, bundle: string): Command | undefined {
  try {
    const cmdImport: CommandConfig = require(commandPath);

    return new Command(bundle, commandPath, cmdImport.command(botState), cmdImport);
  } catch (error) {
    logger.error(`加载命令[${commandPath}]错误：${error}`);
    return undefined;
  }
}

/**
 * 加载命令
 * @param bundle 所属的包名
 * @param commandsDirPath 命令文件夹路径
 */
function loadCommands(bundle: string, commandsDirPath: string): void {
  logger.verbose(`开始加载[${bundle}]下的命令文件。`);
  const files: string[] = readdirSync(commandsDirPath);

  files.forEach((commandFile: string) => {
    const commandPath: string = resolve(commandsDirPath, commandFile);
    if (isScriptFile(commandPath)) {
      const command: Command | undefined = createCommand(commandPath, bundle);
      if (command) {
        botState.CommandManager.add(command);
      }
    }
  });
  logger.verbose(`[${bundle}]下的命令文件加载完毕。`);
}

/**
 * 加载单个包
 * @param bundle 包名
 */
export async function loadBundle(bundle: string): Promise<void> {
  const bundlePath: string = resolve(bundlesPath, bundle);
  if (!existsSync(bundlesPath) || statSync(bundlesPath).isFile()) {
    logger.error(`[${bundle}]包路径错误。`);
    return;
  }
  const features: {
    path: string;
    fn: Function;
  }[] = [
    { path: 'helps', fn: loadHelps },
    { path: 'events', fn: loadEvents },
    { path: 'commands', fn: loadCommands },
  ];

  features.forEach((feature: { path: string; fn: Function }) => {
    const path: string = resolve(bundlePath, feature.path);
    if (existsSync(path)) {
      feature.fn(bundle, path);
    }
  });
}

/**
 * 加载根目录下的全部包
 */
export async function loadBundles(path: string, state: State): Promise<void> {
  logger.verbose('开始加载包。');
  bundlesPath = resolve(path);
  botState = state;
  const bundles = readdirSync(bundlesPath);
  bundles.forEach(async (bundle) => {
    const bundlePath: string = resolve(bundlesPath, bundle);
    if (!statSync(bundlePath).isFile() && bundle !== '.' && bundle !== '..') {
      await loadBundle(bundle);
    }
  });
  logger.verbose('包加载完毕。');
}
