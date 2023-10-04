import initApp from "./app.js";

const app = initApp({ logger: true });

await app.listen({
  port: 3000,
  host: "0.0.0.0",
});
