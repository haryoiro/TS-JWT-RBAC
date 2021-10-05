import { User } from "../entity/User";
import { Connection, createConnection } from "typeorm";

export class DatabaseConfig {
  connection: Connection
  constructor() {
    this.setUpDatabase();
  }

  async setUpDatabase() {
    this.connection = await createConnection()
    return this
  }
}