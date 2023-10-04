import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { setupServer } from "msw/node";
import setupApp from "../src/app";

const server = setupServer();

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  server.close();
});

describe("initial hello world route", () => {
  it("should be true", async () => {
    const app = setupApp({ logger: false });

    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ hello: "world" }));
  });
});
