# Config file

## File structure

```typescript
{
  connectors: {
    [key: string]: { // user defined name for the connector
      type: string, // for example: 'sql-connector'
      config: {
        host: string, // database host
        database: string, // database name
        user: string, // database user
        password: string, // database password
        ssl: boolean | SSLobject, // if ssl is needed
      }
    }
  },
  server: {
    port: number, // port where the application runs
  },
}
```

## SSL Object