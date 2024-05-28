import { Logger } from "next-axiom";

export const remoteLogger = new Logger();

class AppLogger {
  remoteLogger = remoteLogger;
  localLogger = console;

  info(message: string, obj?: any) {
    this.remoteLogger.info(message, obj);
    this.localLogger.info(message, obj);
  }

  async flush() {
    await this.remoteLogger.flush();
  }
}

const logger = new AppLogger();

export default logger;
