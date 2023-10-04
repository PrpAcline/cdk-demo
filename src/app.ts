import fastify from "fastify";
import type http from "node:http";

type FastifyConfig = fastify.FastifyHttpOptions<
  http.Server,
  fastify.FastifyBaseLogger
>;

const initApp = (config: FastifyConfig) => {
  const app = fastify(config);

  app.get("/up", async () => {
    return { up: true };
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

  return app;
};

export default initApp;
