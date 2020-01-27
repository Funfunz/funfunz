# Settings file

## Model structure

```typescript
{
  name: string,
  visible: boolean,
  relations: [
    {
      type: '1:n' | 'n:1' | 'm:n',
      relationalTable: string,
      foreignKey: string,
      remoteForeignKey: string,
      remoteTable: string,
    },
    ...
  ],
  roles: {
    create: [string],  // array of role names
    read: [string],
    write: [string],
    delete: [string],
  },
  columns: [
    {
      name: string,
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
        isTitle: boolean,
        label: string,
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
    label: string,
    listPage: boolean | {
      chips: [
        { 
          label: string, 
          columns: [ { name: string, label: { key: value, ... } }, ],
        },
      ],
      ... // props for frontend table component
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
}
```

## Relations object

```javascript
  relations: {
    manyToMany: [ // array of many to many relations
      {
        verbose: string, // name shown on the frontend
        relationTable: string, // name of the relation table
        foreignKey: string, // foreignKey of the current table on the relation table
        localId: string, // relation field for the current table
        remoteTable: string, // name of the remote table
        remoteForeignKey: string, // foreignKey of the remote table on the relation table
        remoteId: string // relation field for the remote table
      }
    ],
    manyToOne: { // each key is a name of a related table
      string /*table name*/: [ // array of keys used for the relation
        {
          fk: string, // foreign key on the related table
          target: string // key in the current table
        }
      ]
    }
  }
```

## Hooks Object

```javascript
  hooks: {
    getTableData: hookDefinition,
    getTableCount: hookDefinition,
    updateRow: hookDefinition,
    insertRow: hookDefinition,
    deleteRow: hookDefinition
  }

  hookDefinition = {
    after: async (req /* express request */, res /* express response */, DB /* Knex instance */, tableName /* table name */, data /* current result */) => {
      return data
    },
    before: async (req: /* express request */, res /* express response */, DB /* Knex instance */, tableName /* table name */, payload /* payload from the request */) => {
      return payload
    }
  }

```