import {
  Get,
  JsonController,
  Post
} from "routing-controllers";
import { QueryRunner, Connection, getConnection } from "typeorm";

@JsonController("/dev")
export class DevController {
  connection: Connection
  queryRunner: QueryRunner
  constructor() {
    this.connection = getConnection()
    this.queryRunner = this.connection.createQueryRunner()
  }
  @Get("/init")
  async init() {
    await this.queryRunner.query(`DROP TABLE "User"`);
    await this.queryRunner.query(`CREATE TABLE "User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id", "username", "email"))`);
    return {message: "ok"}
  }

  @Get("/hello")
  get() {
    return {
      message: "message"
    }
  }
}