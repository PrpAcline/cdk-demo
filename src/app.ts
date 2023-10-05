import fastify from "fastify";
import type http from "node:http";
import * as ddb from "@aws-sdk/lib-dynamodb";
import { createDynamoDbClient } from "./dynamodb.js";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { ulid } from "ulid";
import { z } from "zod";

const storeSchema = z.object({
  id: z.string(),
  location: z.string(),
});

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
    const ddbDocClient = createDynamoDbClient();

    const response = await ddbDocClient.send(
      new ddb.ScanCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        FilterExpression: "begins_with(sk, :sk)",
        ExpressionAttributeValues: {
          ":sk": "STORE",
        },
      }),
    );

    return {
      type: "stores",
      items:
        response.Items?.map((item) => ({
          id: item.pk,
          location: item.location,
        })) || [],
    };
  });

  app.get("/stores/:id", async (request) => {
    const id = z
      .object({
        id: z.string(),
      })
      .parse(request.params).id;

    const ddbDocClient = createDynamoDbClient();

    const response = await ddbDocClient.send(
      new ddb.QueryCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
        ExpressionAttributeValues: {
          ":pk": id,
          ":sk": "STORE",
        },
      }),
    );

    return {
      type: "store",
      items:
        response.Items?.map((item) => ({
          id: item.pk,
          location: item.location,
        })) || [],
    };
  });

  app.post("/stores", async (request, reply) => {
    try {
      const body = storeSchema.omit({ id: true }).parse(request.body);

      const ddbItem = {
        pk: ulid(),
        sk: `STORE`,
        location: body.location,
      };

      const ddbDocClient = createDynamoDbClient();

      const response = await ddbDocClient.send(
        new ddb.PutCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Item: ddbItem,
        }),
      );

      return reply.code(201).send();
    } catch (error) {
      console.log(error);

      if (error instanceof z.ZodError) {
        return reply.code(422).send({
          missingParameters: (error as z.ZodError).flatten().fieldErrors,
        });
      }

      return reply.code(500).send({ message: "Internal Server Error" });
    }
  });

  app.put("/stores/:id", async (request, reply) => {
    try {
      const id = z
        .object({
          id: z.string(),
        })
        .parse(request.params).id;

      const body = storeSchema.omit({ id: true }).parse(request.body);

      const ddbItem = {
        pk: id,
        sk: `STORE`,
        location: body.location,
      };

      const ddbDocClient = createDynamoDbClient();

      const response = await ddbDocClient.send(
        new ddb.PutCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Item: ddbItem,
        }),
      );

      return reply.code(204).send();
    } catch (error) {
      console.log(error);

      if (error instanceof z.ZodError) {
        return reply.code(422).send({
          missingParameters: (error as z.ZodError).flatten().fieldErrors,
        });
      }

      return reply.code(500).send({ message: "Internal Server Error" });
    }
  });

  app.delete("/stores/:id", async (request, reply) => {
    try {
      const ddbDocClient = createDynamoDbClient();

      const id = z
        .object({
          id: z.string(),
        })
        .parse(request.params).id;

      const response = await ddbDocClient.send(
        new ddb.DeleteCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Key: {
            pk: id,
            sk: `STORE`,
          },
        }),
      );

      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({ message: "Internal Server Error" });
    }
  });

  return app;
};

export default initApp;
