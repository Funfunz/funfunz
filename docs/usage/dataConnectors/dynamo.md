# DynamoDB connector

This connector can be used to connect to any DynamoDB table

At the moment, the connector is using the local machine AWS credentials

## Usage

**Dynamo config**

```js
{
  connectors: {
    [key: string]: { // user defined name for the connector
      type: '@funfunz/dynamodb-data-connector',
      config: {
        region: 'eu-west-1'
      }
    }
    ...
  }
}
```