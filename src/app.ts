import fastify from "fastify";
import type http from "node:http";

type FastifyConfig = fastify.FastifyHttpOptions<
  http.Server,
  fastify.FastifyBaseLogger
>;

const initApp = (config: FastifyConfig) => {
  const app = fastify(config);

  app.get("/", async () => {
    return { hello: "world" };
  });

  return app;
};

export default initApp;
