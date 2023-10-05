import fastify from "fastify";
import type http from "node:http";
import * as dynamo from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createDynamoDbClient } from "./dynamodb.js";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

type FastifyConfig = fastify.FastifyHttpOptions<
  http.Server,
  fastify.FastifyBaseLogger
>;

const initApp = async (config: FastifyConfig) => {
  const app = fastify(config);
  // @ts-ignore - fastify-swagger types are wrong
  await app.register(swagger, { openapi: { info: { title: "API" } } });
  await app.register(swaggerUI, {
    theme: {
      css: [
        {
          filename: "theme.css",
          content: ".topbar-wrapper img { display: none; }",
        },
      ],
    },
  });

  app.get("/up", async () => {
    return { success: true };
  });

  app.get("/stores", async () => {
    return {
      type: "stores",
      items: [
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
      ],
    };
  });

  app.get("/stores/:id/menu", async (request) => {
    const { id } = request.params as { id: string };

    return {
      type: "menu",
      items: [
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
      ],
    };
  });

  app.get("/test", async () => {
    const dynamoDb = createDynamoDbClient();

    const ddbDocClient = DynamoDBDocumentClient.from(dynamoDb);

    const response = await ddbDocClient.send(
      new dynamo.ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME }),
    );

    return {
      success: true,
      response,
    };
  });

  return app;
};

export default initApp;
