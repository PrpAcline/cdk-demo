import initApp from "./app.js";

const app = initApp({ logger: true });

await app.listen({ port: 3000 });
