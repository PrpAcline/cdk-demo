import initApp from "./app.js";
const app = await initApp({ logger: true });
app.listen({
    port: 3000,
    host: "0.0.0.0",
});
