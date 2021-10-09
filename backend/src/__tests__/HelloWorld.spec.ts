import * as request from "supertest";
import { Application } from "../config/Application";

describe("GET /hello-world", () => {


  it("return 200 and correct message", async () => {

    const app = await new Application()
    const api = await request(app.server)
      .get("/login")
      .expect(200)
      .expect({ message: "Hello, World!" });
  });
}); 