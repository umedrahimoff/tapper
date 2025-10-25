/**
 * Safe logging utility for production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  context?: string
  error?: unknown
  timestamp: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context?: string, error?: unknown): LogEntry {
    return {
      level,
      message,
      context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined
      } : error,
      timestamp: new Date().toISOString()
    }
  }

  private log(level: LogLevel, message: string, context?: string, error?: unknown): void {
    const entry = this.formatMessage(level, message, context, error)
    
    // Only log in development or when explicitly enabled
    if (this.isDevelopment) {
      switch (level) {
        case 'info':
          console.info(`[${entry.timestamp}] ${message}`, context ? `[${context}]` : '', error || '')
          break
        case 'warn':
          console.warn(`[${entry.timestamp}] ${message}`, context ? `[${context}]` : '', error || '')
          break
        case 'error':
          console.error(`[${entry.timestamp}] ${message}`, context ? `[${context}]` : '', error || '')
          break
        case 'debug':
          console.debug(`[${entry.timestamp}] ${message}`, context ? `[${context}]` : '', error || '')
          break
      }
    }

    // In production, send to monitoring service
    if (this.isProduction && level === 'error') {
      // TODO: Send to Sentry, LogRocket, or other monitoring service
      // this.sendToMonitoring(entry)
    }
  }

  info(message: string, context?: string): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: string, error?: unknown): void {
    this.log('warn', message, context, error)
  }

  error(message: string, context?: string, error?: unknown): void {
    this.log('error', message, context, error)
  }

  debug(message: string, context?: string): void {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }
}

export const logger = new Logger()
