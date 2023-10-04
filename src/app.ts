import fastify, { FastifyServerFactory } from "fastify";
import type http from "node:http";

type FastifyConfig = fastify.FastifyHttpOptions<
  http.Server,
  fastify.FastifyBaseLogger
>;

const initApp = (config: FastifyConfig) => {
  const app = fastify(config);

  app.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  return app;
};

export default initApp;
