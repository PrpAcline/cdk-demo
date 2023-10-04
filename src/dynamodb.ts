import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const getDynamoEndpoint = () => {
  if (process.env.DOCKER_COMPOSE === "true") {
    return "http://dynamodb-local:8000";
  }

  if (process.env.NODE_ENV === "production") {
    // undefined will use the default endpoint for aws
    return undefined;
  }

  return "http://localhost:8000";
};

export const createDynamoDbClient = () => {
  return new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-2",
    endpoint: getDynamoEndpoint(),
  });
};
