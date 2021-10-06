import * as request from "supertest";
import { Application } from "../config/Application";


let app

describe("GET /hello-world", () => {
  beforeEach(async () => {
    app = await new Application().app()
  });
  it("return 200 and correct message", async () => {
    await request(app)
      .get("/login")
      .expect(200)
      .expect({ message: "Hello, World!" });
  });
}); 