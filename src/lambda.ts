import fastifyLambda from "@fastify/aws-lambda";
import app from "./app.js";

// export const handler = fastifyLambda(app());

export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello world",
    }),
  };
};

export const handler2 = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello world",
    }),
  };
})
