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
    this.init()
  }

  private async init() {
    this.connection = await new DatabaseConfig()
    this.express = await new ExpressConfig()
    const port = await config.get("express.port")
    this.server = await this.express.app.listen(port, () => {
      logger.info(`
---------------------------
  Server ready
  http://localhost:${port}
---------------------------
      `)
    })
    return this
  }
  /**
   * jestでのテスト時に使用する
   * @returns Express
   */
  public app() {
    return this.express.app
  }
}