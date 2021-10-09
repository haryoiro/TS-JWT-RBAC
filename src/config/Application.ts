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
    this.app()
  }

  /**
   * jestでのテスト時に使用する
   * @returns Express
   */
  public async app() {
    try {
      this.connection = await new DatabaseConfig()
      this.express = await new ExpressConfig()
      const port: number = await config.get("express.port") || 8000
      this.server = await this.express.app.listen(port, "127.0.0.1", () => {
        logger.info(`Server ready at http://localhost:${port}`)
      })
      return await this.server
    } catch(e) {
      console.log(e)
    }
  }
}