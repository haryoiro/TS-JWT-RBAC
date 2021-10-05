import * as request from "supertest";
import { Application } from "../config/Application";

describe("GET /hello-world", () => {
  it("return 200 and correct message", () => {
    const server = new Application();
    
    return request(server.server)
      .get("/hello-world")
      .expect(200)
      .expect({ message: "Hello, World!" });
  });
});