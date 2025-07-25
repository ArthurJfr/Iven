interface LogEntry {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug' | 'log';
  message: string;
  timestamp: Date;
}

class LoggerService {
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];
  private originalConsole: any = {};

  constructor() {
    this.interceptConsole();
  }

  private interceptConsole() {
    // Sauvegarder les méthodes originales
    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
    };

    const addLog = (level: LogEntry['level'], ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      const newLog: LogEntry = {
        id: Date.now().toString(),
        level,
        message,
        timestamp: new Date(),
      };

      this.logs.push(newLog);
      this.notifyListeners();
    };

    // Surcharger les méthodes console
    console.log = (...args: any[]) => {
      this.originalConsole.log(...args);
      addLog('log', ...args);
    };

    console.error = (...args: any[]) => {
      this.originalConsole.error(...args);
      addLog('error', ...args);
    };

    console.warn = (...args: any[]) => {
      this.originalConsole.warn(...args);
      addLog('warn', ...args);
    };

    console.info = (...args: any[]) => {
      this.originalConsole.info(...args);
      addLog('info', ...args);
    };

    console.debug = (...args: any[]) => {
      this.originalConsole.debug(...args);
      addLog('debug', ...args);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.logs]));
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    // Retourner immédiatement les logs existants
    listener([...this.logs]);
    
    // Retourner une fonction pour se désabonner
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.notifyListeners();
  }

  addTestLogs() {
    console.log('Test log message');
    console.error('Test error message');
    console.warn('Test warning message');
  }
}

// Instance singleton
export const loggerService = new LoggerService(); 