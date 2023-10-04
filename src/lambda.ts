import fastifyLambda from "@fastify/aws-lambda";
import app from "./app.js";

export const handler = fastifyLambda(app({ logger: true }));
