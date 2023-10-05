import { test, expect, afterEach, beforeEach, vi } from "vitest";
import { rest } from "msw";
import { setupServer } from "msw/node";
import initApp from "../src/app";
import { marshall } from "@aws-sdk/util-dynamodb";

const server = setupServer();

vi.stubEnv("DYNAMODB_TABLE_NAME", "fantastic-tacos");
vi.stubEnv("AWS_PROFILE", "");
vi.stubEnv("AWS_ACCESS_KEY_ID", "DUMMYIDEXAMPLE");
vi.stubEnv("AWS_SECRET_ACCESS_KEY", "DUMMYEXAMPLEKEY");
vi.stubEnv("AWS_REGION", "us-east-2");

server.listen({
  onUnhandledRequest: "warn",
});

afterEach(() => {
  server.resetHandlers();
});

const storesFixture = [
  {
    pk: "store#1",
    sk: "store#1",
    location: "London",
  },
  {
    pk: "store#2",
    sk: "store#2",
    location: "Paris",
  },
  {
    pk: "store#3",
    sk: "store#3",
    location: "New York",
  },
  {
    pk: "store#4",
    sk: "store#3",
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

test("GET /up route that always returns 200", async () => {
  const app = await initApp({ logger: false });
  const response = await app.inject({
    method: "GET",
    url: "/up",
  });

  expect(response.statusCode).toEqual(200);
});

test("GET /stores route that returns the list of stores", async () => {
  const dynamoDb = vi.fn();
  server.use(
    rest.post("http://localhost:8000/", async (req, res, ctx) => {
      dynamoDb(req.headers.get("x-amz-target"), await req.json());

      return res(
        ctx.status(200),
        ctx.json({
          Items: storesFixture.map((store) => marshall(store)),
          Count: storesFixture.length,
        }),
      );
    }),
  );

  const app = await initApp({ logger: false });
  const response = await app.inject({
    method: "GET",
    url: "/stores",
  });

  expect(response.statusCode).toEqual(200);
  expect(response.json()).toEqual({
    type: "stores",
    items: storesFixture.map((item) => ({
      id: item.pk.split("#")[1],
      location: item.location,
    })),
  });

  expect(dynamoDb).toHaveBeenCalledWith("DynamoDB_20120810.Query", {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    KeyConditions: {
      pk: {
        ComparisonOperator: "BEGINS_WITH",
        AttributeValueList: [marshall("STORE")],
      },
    },
  });
});
