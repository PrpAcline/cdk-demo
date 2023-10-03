import fastify from "fastify";

const initApp = () => {
  const app = fastify({
    logger: true,
  });

  app.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  return app;
};

export default initApp;
