# Settings file

## Model structure

```typescript
{
  name: string, // sql table name
  connector: string, // name of the connector defined on the config file
  visible: boolean, // if this table is visible in the API
  relations: [
    {
      type: '1:n' | 'n:1' | 'm:n',
      relationalTable: string, // the table containing the foreign keys
      foreignKey: string, // local id in the relationalTable
      remoteForeignKey: string, // remote id in the relationalTable 
      remoteTable: string,
    },
    ...
  ],
  roles: {
    create: [string],  // array of role names
    read: [string],
    update: [string],
    delete: [string],
  },
  columns: [
    {
      name: string,  // column name
      searchable: boolean,  // field used on search
      visible: {
        list: boolean,  // field is returned on list requests
        detail: boolean,  // field is returned on single get request
        relation: boolean,  // field is returned on relation requests
      },
      model: boolean | {
        isPk: boolean,  // if column is primary key
        type: string,  // sql column type
        allowNull: boolean,
        ...  // other sql column options
      },
      layout: {
        isTitle: boolean, // if column is used as item title
        label: string, // label used on frontend
        listColumn: boolean | {
          ...  // props for the frontend column component
        },
        editField: boolean | {
          type: string,
          ...  // other props for the frontend input component 
        },
      },
    },
    ...
  ],
  ...
  layout: {
    label: string,  // table name used on frontend
    listPage: boolean | {
      chips: [
        { 
          label: string, 
          columns: [ { name: string, label: { key: value, ... } }, ],
        },
      ],
      ... // other props for frontend table component
    },
    searchField: boolean | {
      ... // props for frontend search component
    },
    createButton: boolean | {
      ...  // props for frontend create button component
    },
    editButton: boolean | {
      ...  // other props for frontend edit button component
    },
    editPage: boolean | {
      sections: [
        { id: string, label: string, accordion: true|false, ... },  
      ],
      ...  // other props for frontend edit page
    },
    deleteButton: boolean | {
      ... // props for frontend delete button component
    },
  },
  ...
  hooks: {
    [key in Hooks]?: {
      before?: IHookFunction,
      after?: IHookFunction,
    }
  },
}
```

## Hooks Object

```typescript
  type Hooks = 'getTableData'
    | 'getDistinctTableData'
    | 'getTableCount'
    | 'getRow'
    | 'insertRow'
    | 'updateRow'
    | 'deleteRow'
  

  IHookFunction = (
    req: express.Request,
    res: express.Response,
    DB: knex,
    tableName: string,
    data?: any
  ) => Promise <any>

```