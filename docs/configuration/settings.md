# Settings file

## Array of entities

```js
return [
  {
    ...
    entity1
    ...
  }
  {
    ...
    entity2
    ...
  }
]
```

## Entity structure

```js
{
  name: string, // entity name
  connector: string, // user defined name of the connector set on the config file
  visible: boolean, // if this entity is visible on the API
  relations: [
    {
      type: '1:n' | 'n:1' | 'm:n',
      relationalEntity: string, // the table containing the foreign keys
      foreignKey: string, // local id in the relationalEntity 
      remoteForeignKey: string, // remote id in the relationalEntity 
      remoteEntity: string,
    },
    ...
  ],
  columns: [
    {
      name: string,  // column name
      type: string,  // sql column type
      searchable: boolean,  // field used on search
      visible: {
        list: boolean,  // field is returned on list requests
        detail: boolean,  // field is returned on single get request
        relation: boolean,  // field is returned on relation requests
      },
      isPk: boolean,  // if column is primary key
      required: boolean
    },
    ...
  ],
  ...
  hooks: HooksObject
}
```

**HooksObject**: check the [Hooks page](usage/hooks.md) for more info
