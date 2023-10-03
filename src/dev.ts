import app from "./app.js";

(async () => {
  await app().listen({
    port: 3000,
  });
})();
