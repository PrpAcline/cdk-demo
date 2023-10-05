import { App, Stack } from "aws-cdk-lib";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

const app = new App();

const stack = new Stack(app, "MyStack", {
  stackName: "fantasticTaco",
  env: {
    account: "423956910718",
    region: "us-east-2",
  },
});

// PLAN

const table = new Table(stack, "1", {
  tableName: "eugine2",
  partitionKey: {
    name: "pk",
    type: AttributeType.STRING,
  },
  sortKey: {
    name: "sk",
    type: AttributeType.STRING,
  },
});

// ADD API GATEWAY

const lambda = new NodejsFunction(stack, "api-function", {
  functionName: "TacoApi2",
  entry: "src/lambda.ts",
  handler: "handler",
  runtime: Runtime.NODEJS_18_X,
  architecture: Architecture.ARM_64,
  bundling: {
    target: "node18",
    format: OutputFormat.ESM,
    nodeModules: ["fastify", "@fastify/swagger", "@fastify/swagger-ui"],
  },
  environment: {
    DYNAMODB_TABLE_NAME: table.tableName,
  },
});

table.grantReadWriteData(lambda);

const api = new HttpApi(stack, "api");

api.addRoutes({
  path: "/{proxy+}",
  integration: new HttpLambdaIntegration("api-function-integration", lambda),
});
