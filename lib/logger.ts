// lib/logger.ts
// Sistema de logging centralizado con niveles y control de producción
// En producción, solo logs de ERROR y WARN se envían a monitoring

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogContext {
  component?: string;
  userId?: string;
  sessionId?: string;
  action?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private component: string;

  constructor(component: string = 'App') {
    this.component = component;
    // En Next.js, process.env.NODE_ENV está disponible
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] [${this.component}] ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    // En desarrollo: loguear todo
    if (this.isDevelopment) {
      return true;
    }

    // En producción: solo WARN y ERROR
    return level === 'WARN' || level === 'ERROR';
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('DEBUG')) {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('INFO')) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('WARN')) {
      console.warn(this.formatMessage('WARN', message, context));
      // TODO: En producción, enviar a Sentry/Upstash
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog('ERROR')) {
      const errorContext = {
        ...context,
        error: error?.message,
        stack: this.isDevelopment ? error?.stack : undefined // Solo stack en dev
      };
      console.error(this.formatMessage('ERROR', message, errorContext));
      // TODO: En producción, enviar a Sentry/Upstash
    }
  }

  // Helper para loguear inicio/fin de operaciones
  operation(operationName: string, context?: LogContext): OperationLogger {
    return new OperationLogger(this, operationName, context);
  }
}

// Helper para loguear operaciones con duración
class OperationLogger {
  private logger: Logger;
  private operationName: string;
  private context?: LogContext;
  private startTime: number;

  constructor(logger: Logger, operationName: string, context?: LogContext) {
    this.logger = logger;
    this.operationName = operationName;
    this.context = context;
    this.startTime = Date.now();
    this.logger.debug(`Starting: ${operationName}`, context);
  }

  success(message?: string, additionalContext?: LogContext): void {
    const duration = Date.now() - this.startTime;
    this.logger.info(
      message || `Completed: ${this.operationName}`,
      { ...this.context, ...additionalContext, duration }
    );
  }

  failure(error: Error, additionalContext?: LogContext): void {
    const duration = Date.now() - this.startTime;
    this.logger.error(
      `Failed: ${this.operationName}`,
      error,
      { ...this.context, ...additionalContext, duration }
    );
  }
}

// Factory para crear loggers con componente específico
export function createLogger(component: string): Logger {
  return new Logger(component);
}

// Logger por defecto
export const logger = new Logger('App');

// Export types
export type { LogLevel, LogContext };
