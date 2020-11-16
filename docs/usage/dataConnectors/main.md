# Data connectors

Funfunz uses **data connectors** to connect the models with the source of data.

## Usage

The data connectors are linked to a settings model and the specific connector configuration should be set on the config file.

Check [config](../configuration/config.md) and [settings](../configuration/settings.md) for a full example.

**Config file**

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

**Entity model**

```js
{
  name: string, // entity name
  connector: string, // user defined name of the connector set on the config file
  visible: boolean, // if this entity is visible on the API
  ...
}
```
