# Hooks

The Hook system exists to give flexibility to the developer to add more control over the life cycle of a GraphQL query.

## Life Cycle

```plantuml
@startuml
start
  :Message Received;
  #cyan:Hook before resolver;
  :Resolver;
  #cyan:Hook before send query;
  :Query sent to Data Connector;
  :Data recieved from Data Connector;
  #cyan:Hook after data received;
  :Message sent to user;
  #cyan:Hook after sending message to user;
stop
@enduml
```

## Hook types

When defining the model configuration, the developer can add custom functions to each of the above Hooks.

The hooks have been devided into operation types and hook type:

**OperationTypes**
- **all:** applies to all operations
- **config:** runs when the user requests the table configuration
- **count:** runs when the user requests an item count
- **add:** runs when the user requests to add an item
- **query:** runs when the user requests entity data
- **update** runs when the user requests to update an item
- **delete:** runs when the user requests to delete an item

**HookTypes**
- **beforeResolver:** runs before anything else, raw data from the user
- **beforeSendQuery:** runs before the Data Connector is called
- **afterQueryResult:** runs after the Data Connector resolves the request
- **afterResultSent:** runs after the response has been sent to the user

## Usage example

**Entity model**
```js
{
  name: string, // entity name
  connector: string, // user defined name of the connector set on the config file
  visible: boolean, // if this entity is visible on the API
  hooks: {
    [OperationType]: { // the type of operation to hook, one of the OperationTypes
      [HookType]: async (props: IHookProps<RequestContext>) { // the hook type, one of the HookTypes
        /*
         * ...
         * someCode
         * ...
         */
        return props // always return the props to continue the life cycle
      }
    }
  },
  ...
}
```

## IHookProps interface

```js
export interface IHookProps<RequestContext, U extends User = User> {
  graph: ExecuteGraphQL
  connector: DataConnector
  user: U
  args: IArgs
  query?: IQueryArgs | IUpdateArgs | ICreateArgs | IRemoveArgs
  results?: unknown
  context?: RequestContext 
}
```

- **graph:** a global instance of GraphQL that has super user access, this is good to check for user permissions for example.
- **connector:** the Data Connector instance for the requested entity.
- **user:** the current user information. Will be an empty unauthenticated user if no user is set in the GraphQL context.
- **args:** arguments passed during the query request.
- **query:** arguments parsed that will/was used by the connector. Also on the `beforeResolver` hook, this parse hasn't occured yet, so the value is `undefined.
- **results:** will contain the results from the Data Connector, only available on `afterQueryResult` and `afterResultSent`.
- **context:** this is an object created for each request that will contain context that can be used across multiple hooks on the same request.  