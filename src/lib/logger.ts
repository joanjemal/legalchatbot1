/**
 * Enhanced logging utility for the chatbot application
 * Provides consistent logging format with request IDs, timestamps, and emojis
 */

export interface LogContext {
  requestId?: string;
  component?: string;
  operation?: string;
  duration?: number;
  data?: unknown;
}

export class Logger {
  private static generateRequestId(prefix: string = 'req'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static formatMessage(level: string, message: string, context?: LogContext): string {
    const requestId = context?.requestId || this.generateRequestId();
    const component = context?.component ? `[${context.component}]` : '';
    const operation = context?.operation ? `[${context.operation}]` : '';
    const duration = context?.duration ? `(${context.duration}ms)` : '';
    
    return `${level} ${component} ${operation} [${requestId}] ${message} ${duration}`.replace(/\s+/g, ' ').trim();
  }

  static info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('ℹ️', message, context));
  }

  static success(message: string, context?: LogContext): void {
    console.log(this.formatMessage('✅', message, context));
  }

  static warning(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('⚠️', message, context));
  }

  static error(message: string, context?: LogContext): void {
    console.error(this.formatMessage('❌', message, context));
  }

  static debug(message: string, context?: LogContext): void {
    console.log(this.formatMessage('🔍', message, context));
  }

  static chat(message: string, context?: LogContext): void {
    console.log(this.formatMessage('💬', message, context));
  }

  static database(message: string, context?: LogContext): void {
    console.log(this.formatMessage('💾', message, context));
  }

  static api(message: string, context?: LogContext): void {
    console.log(this.formatMessage('🌐', message, context));
  }

  static performance(message: string, context?: LogContext): void {
    console.log(this.formatMessage('⚡', message, context));
  }

  // Utility method to measure execution time
  static async measureTime<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    const requestId = context?.requestId || this.generateRequestId();
    
    this.info(`Starting ${operationName}`, { ...context, requestId });
    
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      this.success(`${operationName} completed`, { ...context, requestId, duration });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(`${operationName} failed`, { 
        ...context, 
        requestId, 
        duration,
        data: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}

export default Logger;
