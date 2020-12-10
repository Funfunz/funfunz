# Configuration

A Funfunz middleware requires two different configurations files.

- [Config](configuration/config.md): contains the middleware configuration for the connectors
- [Settings](configuration/settings.md): contains an array of objects that represent all the entities that the GraphQL will serve

For more information about `queries` and `mutations`follow this [link](usage/customSchema.md)
## Type definition

```js
export interface IFunfunzConfig<QSource = unknown, QContext = unknown> {
  config: IConfig
  settings: ISettings
  queries?: Thunk<GraphQLFieldConfigMap<QSource, QContext>>
  mutations?: Thunk<GraphQLFieldConfigMap<QSource, QContext>>
}
```