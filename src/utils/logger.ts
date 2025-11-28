/**
 * Structured logging utility for production-ready logging
 * Supports different log levels and environment-based configuration
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  service: string;
  userId?: string;
}

class Logger {
  private serviceName: string;
  private minLevel: LogLevel;

  constructor(serviceName: string = 'secret-santa-web') {
    this.serviceName = serviceName;
    // In production, only log WARN and ERROR by default
    // In development, log everything
    this.minLevel = import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      // Could add userId from auth store if needed
    };
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const entry = this.formatMessage(level, message, data);

    if (import.meta.env.PROD) {
      // In production, use structured JSON logging for log aggregation
      console.log(JSON.stringify(entry));
    } else {
      // In development, use colored console output
      const colors = {
        [LogLevel.DEBUG]: '\x1b[36m', // Cyan
        [LogLevel.INFO]: '\x1b[32m',  // Green
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.ERROR]: '\x1b[31m', // Red
      };

      const levelNames = {
        [LogLevel.DEBUG]: 'DEBUG',
        [LogLevel.INFO]: 'INFO',
        [LogLevel.WARN]: 'WARN',
        [LogLevel.ERROR]: 'ERROR',
      };

      const color = colors[level];
      const reset = '\x1b[0m';
      const levelName = levelNames[level];

      console.log(`${color}[${levelName}]${reset} ${entry.service}: ${message}`, data || '');
    }
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  // Convenience methods for common patterns
  auth(message: string, data?: any): void {
    this.info(`AUTH: ${message}`, data);
  }

  api(message: string, data?: any): void {
    this.debug(`API: ${message}`, data);
  }

  userAction(action: string, data?: any): void {
    this.info(`USER_ACTION: ${action}`, data);
  }
}

// Create singleton instance
export const logger = new Logger();

// Export for testing or custom instances
export { Logger };