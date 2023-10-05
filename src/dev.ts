import app from "./app.js";

(await app({ logger: true })).listen({
  port: 3000,
});
