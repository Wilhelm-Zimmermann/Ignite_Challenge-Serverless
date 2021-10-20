import type { AWS } from '@serverless/typescript';

import createTodo from '@functions/createTodo';
import getTodos from '@functions/getTodos';

const serverlessConfiguration: AWS = {
  service: 'ts-todo-sls',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
    dynamodb: {
      stages: ['dev','local'],
      start:{
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  plugins: ['serverless-esbuild','serverless-offline','serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      dbCertificateUsers: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: "todo_list",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: 'user_id',
              AttributeType: 'S'
            },
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ],
          KeySchema:[
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'user',
              KeySchema: [
                {
                  AttributeName: 'user_id',
                  KeyType: 'HASH'
                }
              ],
              Projection: {
                ProjectionType: 'ALL'
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
              }
            }
          ]
        }
      }
    }
  },
  functions: { createTodo, getTodos },
};

module.exports = serverlessConfiguration;
