# Config file

## File structure

```js
{
  connectors: {
    [key: string]: { // user defined name for the connector
      type: string, // the connector to use, for example: 'sql-connector'
      config: any, // the configuration required for the specific connector
    }
  },
  server: {
    port: number, // port where the application runs
  },
}
```

## SSL Object