/**
 * DEBUG UTILITY
 * Comprehensive debugging and error tracking system
 * Helps identify issues early and provides detailed logs
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  stack?: string;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private enabled: boolean = __DEV__; // Only in development
  private maxLogs: number = 100;

  /**
   * Log general information
   */
  info(category: string, message: string, data?: any) {
    this.log('info', category, message, data);
  }

  /**
   * Log warnings
   */
  warn(category: string, message: string, data?: any) {
    this.log('warn', category, message, data);
  }

  /**
   * Log errors with stack trace
   */
  error(category: string, message: string, error?: any) {
    const stack = error?.stack || new Error().stack;
    this.log('error', category, message, { error, stack });
    
    // Also log to console.error for visibility
    console.error(`[${category}] ${message}`, error);
  }

  /**
   * Log debug information (verbose)
   */
  debug(category: string, message: string, data?: any) {
    this.log('debug', category, message, data);
  }

  /**
   * Log success messages
   */
  success(category: string, message: string, data?: any) {
    this.log('success', category, message, data);
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, category: string, message: string, data?: any) {
    if (!this.enabled) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
    };

    this.logs.push(entry);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with colors
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🔍',
      success: '✅',
    };

    const color = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m',   // Red
      debug: '\x1b[90m',   // Gray
      success: '\x1b[32m', // Green
    };

    const reset = '\x1b[0m';

    console.log(
      `${emoji[level]} ${color[level]}[${category}]${reset} ${message}`,
      data ? data : ''
    );
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs by category
   */
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    this.info('Debug', 'Logs cleared');
  }

  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.logs.filter(log => log.level === 'error').length;
  }

  /**
   * Get warning count
   */
  getWarningCount(): number {
    return this.logs.filter(log => log.level === 'warn').length;
  }
}

// Export singleton instance
export const logger = new DebugLogger();

/**
 * Track API calls
 */
export function trackApiCall(
  service: string,
  method: string,
  params?: any
) {
  logger.debug('API', `${service}.${method}`, params);
}

/**
 * Track API success
 */
export function trackApiSuccess(
  service: string,
  method: string,
  result?: any
) {
  logger.success('API', `${service}.${method} succeeded`, result);
}

/**
 * Track API error
 */
export function trackApiError(
  service: string,
  method: string,
  error: any
) {
  logger.error('API', `${service}.${method} failed`, error);
}

/**
 * Track navigation
 */
export function trackNavigation(from: string, to: string) {
  logger.debug('Navigation', `${from} → ${to}`);
}

/**
 * Track auth events
 */
export function trackAuth(event: string, data?: any) {
  logger.info('Auth', event, data);
}

/**
 * Track payment events
 */
export function trackPayment(event: string, data?: any) {
  logger.info('Payment', event, data);
}

/**
 * Wrapper for async functions with error tracking
 */
export function withErrorTracking<T>(
  category: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  logger.debug(category, `Starting: ${operation}`);
  
  return fn()
    .then(result => {
      logger.success(category, `Completed: ${operation}`);
      return result;
    })
    .catch(error => {
      logger.error(category, `Failed: ${operation}`, error);
      throw error;
    });
}

/**
 * Assert that a value is not null/undefined
 */
export function assertExists<T>(
  value: T | null | undefined,
  message: string
): T {
  if (value === null || value === undefined) {
    logger.error('Assertion', `Assertion failed: ${message}`, { value });
    throw new Error(`Assertion failed: ${message}`);
  }
  return value;
}

/**
 * Validate environment variables
 */
export function validateEnv() {
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing: string[] = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    logger.error(
      'Config',
      'Missing required environment variables',
      { missing }
    );
    return false;
  }

  logger.success('Config', 'All required environment variables present');
  return true;
}

/**
 * Log Supabase connection test
 */
export function logSupabaseConnection(success: boolean, error?: any) {
  if (success) {
    logger.success('Supabase', 'Connection successful');
  } else {
    logger.error('Supabase', 'Connection failed', error);
  }
}

/**
 * Performance tracking
 */
export class PerformanceTracker {
  private startTime: number;
  private category: string;
  private operation: string;

  constructor(category: string, operation: string) {
    this.category = category;
    this.operation = operation;
    this.startTime = Date.now();
    logger.debug(category, `Performance tracking started: ${operation}`);
  }

  end() {
    const duration = Date.now() - this.startTime;
    logger.info(
      this.category,
      `Performance: ${this.operation} took ${duration}ms`
    );
    return duration;
  }
}

/**
 * Debug panel data for UI display
 */
export function getDebugPanelData() {
  return {
    errorCount: logger.getErrorCount(),
    warningCount: logger.getWarningCount(),
    totalLogs: logger.getLogs().length,
    recentErrors: logger.getLogsByLevel('error').slice(-5),
    recentWarnings: logger.getLogsByLevel('warn').slice(-5),
  };
}

// Log initialization
if (__DEV__) {
  logger.info('Debug', 'Debug logger initialized');
  validateEnv();
}

export default logger;
