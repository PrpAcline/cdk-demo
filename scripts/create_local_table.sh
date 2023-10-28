#! /bin/bash

export AWS_ACCESS_KEY_ID=DUMMYIDEXAMPLE
export AWS_SECRET_ACCESS_KEY=DUMMYEXAMPLEKEY
export AWS_REGION=us-east-2



aws dynamodb create-table --table-name $(TABLE_NAME) \
    --attribute-definitions AttributeName=pk,AttributeType=S AttributeName=sk,AttributeType=S \
    --key-schema AttributeName=pk,KeyType=HASH AttributeName=sk,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --endpoint-url http://localhost:8000 \
