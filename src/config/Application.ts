import * as config from 'config';
import { Server } from 'http'
import { logger } from '../common/Logging'
import { ExpressConfig } from "./Express";
import { DatabaseConfig } from "./Database";


export class Application {
  server: Server;
  express: ExpressConfig;
  connection: DatabaseConfig;
  constructor() {
    this.connection = new DatabaseConfig()
    this.express = new ExpressConfig()
  }

  /**
   * jestでのテスト時に使用する
   * @returns Express
   */
  public async app() {
    const port: number = await config.get("express.port") || 8000
    await this.express.app.listen(port, "172.0.0.1", () => {
      logger.info(`
---------------------------
  Server ready
  http://localhost:${port}
---------------------------
      `)
    })
    return await this.express.app
  }
}