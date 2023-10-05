import { App, Stack } from "aws-cdk-lib";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  Architecture,
  FunctionUrl,
  FunctionUrlAuthType,
} from "aws-cdk-lib/aws-lambda";

const app = new App();

const stack = new Stack(app, "MyStack", {
  env: {
    account: "423956910718",
    region: "us-east-2",
  },
});

const lambda = new NodejsFunction(stack, "MyFunction", {
  entry: "src/lambda.ts",
  handler: "handler",
  architecture: Architecture.ARM_64,
  bundling: {
    target: "node18",
    format: OutputFormat.ESM,
  },
});

const url = new FunctionUrl(stack, "MyFunctionUrl", {
  function: lambda,
  authType: FunctionUrlAuthType.NONE,
});
