import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { setupServer } from "msw/node";

const server = setupServer();

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  server.close();
});

describe("dummy app", () => {
  it("should be true", () => {
    expect(true).toBe(true);
  });
});
