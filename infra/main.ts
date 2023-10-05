import { App, Stack } from "aws-cdk-lib";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  Architecture,
  FunctionUrl,
  FunctionUrlAuthType,
  Runtime,
} from "aws-cdk-lib/aws-lambda";

const app = new App();

const stack = new Stack(app, "MyStack", {
  env: {
    account: "423956910718",
    region: "us-east-2",
  },
});

const lambda = new NodejsFunction(stack, "api-function", {
  functionName: "TacoApi",
  entry: "src/lambda.ts",
  handler: "handler",
  runtime: Runtime.NODEJS_18_X,
  architecture: Architecture.ARM_64,
  bundling: {
    target: "node18",
    format: OutputFormat.ESM,
    nodeModules: ["fastify", "@fastify/swagger", "@fastify/swagger-ui"],
  },
});

const url = new FunctionUrl(stack, "MyFunctionUrl", {
  function: lambda,
  authType: FunctionUrlAuthType.NONE,
});
