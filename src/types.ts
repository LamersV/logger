export enum LogColor {
  RED = '\x1b[31m',
  YELLOW = '\x1b[33m',
  BLUE = '\x1b[34m',
  GREEN = '\x1b[32m',
  RESET = '\x1b[0m'
}

export type LogLevelType = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export interface LogLevel {
  label: string;
  color: LogColor;
}

export interface LogConfig {
  datetime?: boolean;
  saveOnFile?: boolean;
  saveOnError?: boolean;
  filename?: string;
  errorFilename?: string;
  outputPath?: string;
  maxFileSize?: number;
}