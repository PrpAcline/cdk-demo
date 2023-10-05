import { test, expect, afterEach, beforeEach, vi } from "vitest";
import { setupServer } from "msw/node";
import initApp from "../src/app";

const server = setupServer();

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  server.close();
});

const storesFixture = [
  {
    id: "1",
    location: "London",
  },
  {
    id: "2",
    location: "Paris",
  },
  {
    id: "3",
    location: "New York",
  },
  {
    id: "4",
    location: "Tokyo",
  },
];

const menuFixture = [
  {
    id: "1",
    name: "Lava Taco",
    price: 2.5,
  },
  {
    id: "2",
    name: "Lava Burrito",
    price: 5,
  },
  {
    id: "3",
    name: "Lava Bowl",
    price: 7.5,
  },
];

test("/up route that always returns 200", async () => {
  const app = await initApp({ logger: false });
  const response = await app.inject({
    method: "GET",
    url: "/up",
  });

  expect(response.statusCode).toEqual(200);
});

test("/stores route that returns the list of stores", async () => {
  const app = await initApp({ logger: false });
  const response = await app.inject({
    method: "GET",
    url: "/stores",
  });

  expect(response.statusCode).toEqual(200);
  expect(response.json()).toEqual({
    type: "stores",
    items: storesFixture,
  });
});

test("/stores/:id/menu route that returns the list of menu items", async () => {
  const app = await initApp({ logger: false });
  const response = await app.inject({
    method: "GET",
    url: "/stores/1/menu",
  });

  expect(response.statusCode).toEqual(200);
  expect(response.json()).toEqual({
    type: "menu",
    items: menuFixture,
  });
});
