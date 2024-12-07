import { LogColor, LogConfig, LogLevel, LogLevelType } from "./types";
import { mkdir, appendFile } from "fs/promises";
import { existsSync } from "fs";

export class Logger {
  private static config: LogConfig = {
    datetime: true,
    saveOnFile: true,
    saveOnError: true,
    filename: 'server',
    errorFilename: 'error',
    outputPath: './logs',
    maxFileSize: 1024 * 1024 * 10,
  }

  private static levels: Record<string, LogLevel> = {
    'ERROR': { label: 'ERROR', color: LogColor.RED },
    'WARN': { label: 'WARN', color: LogColor.YELLOW },
    'INFO': { label: 'INFO', color: LogColor.BLUE },
    'DEBUG': { label: 'DEBUG', color: LogColor.GREEN }
  }

  private static log(level: LogLevelType, message: any, ...args: any[]) {
    const current = this.levels[level];
    const levelType = `${current.color}[${current.label}]${LogColor.RESET}`

    let text = `${levelType} ${message}`;

    if (Logger.config.datetime) {
      const dateTime = dateFormated();
      text = `[${dateTime}]${text}`;
    }

    console.log(text, ...args);
    this.saveOnFile(text);

    if (level === 'ERROR') this.saveErrorOnFile(text);
  }

  static info(message: any, ...args: any[]) {
    this.log('INFO', message, ...args)
  }

  static warn(message: any, ...args: any[]) {
    this.log('WARN', message, ...args)
  }

  static error(message: any, ...args: any[]) {
    this.log('ERROR', message, ...args)
  }

  static debug(message: any, ...args: any[]) {
    this.log('DEBUG', message, ...args)
  }

  static setConfig(config: LogConfig) {
    this.config = { ...this.config, ...config };
  }

  private static async saveOnFile(message: string) {
    await saveFile(this.config, message);
  }

  private static async saveErrorOnFile(message: string) {
    await saveFile({ ...this.config, filename: this.config.errorFilename! }, message);
  }
}

const saveFile = async (config: LogConfig, message: string) => {
  if (!config.saveOnFile) return;

  const logPath = `${config.outputPath}/${config.filename}.log`;

  if (!existsSync(config.outputPath!)) {
    await mkdir(config.outputPath!, { recursive: true });
  }

  const log = `${message.replace(/\x1b\[\d+m/g, '')}\n`;

  try {
    await appendFile(logPath, log, { flag: 'a' });
  }
  catch (error) {
    console.error('Error saving log on file', error);
  }
}

const dateFormated = (): string => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}