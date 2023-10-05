import fastifyLambda from "@fastify/aws-lambda";
import app from "./app.js";
export const handler = fastifyLambda(await app({ logger: true }));
