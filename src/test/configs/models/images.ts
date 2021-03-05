export default {
  name: 'images',
  connector: 'mainDatabase',
  visible: true,
  properties: [
    {
      name: 'id',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: true
      },
      model: {
        type: 'number',
        allowNull: false,
        isPk: true
      },
      layout: {
        label: 'Id',
        listColumn: {},
        editField: {}
      }
    },
    {
      name: 'name',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      model: {
        type: 'string',
        allowNull: true
      },
      layout: {
        label: 'Name',
        listColumn: {},
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'main',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      model: {
        type: 'boolean',
        allowNull: false
      },
      layout: {
        label: 'Main',
        listColumn: {},
        editField: {
          type: 'checkbox'
        }
      }
    },
    {
      name: 'createdAt',
      filterable: true,
      visible: {
        list: true,
        detail: false,
        relation: false
      },
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'CreatedAt',
        listColumn: {},
        editField: {
          type: 'date'
        }
      }
    },
    {
      name: 'updatedAt',
      filterable: true,
      visible: {
        list: true,
        detail: false,
        relation: false
      },
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'UpdatedAt',
        listColumn: {},
        editField: {
          type: 'date'
        }
      }
    },
    {
      name: 'ProductId',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      model: {
        type: 'number',
        allowNull: true
      },
      layout: {
        label: 'ProductId',
        listColumn: {},
        editField: {
          type: 'number'
        }
      }
    }
  ],
  layout: {
    label: 'Images',
    listPage: {},
    searchField: {},
    createButton: {},
    editButton: {},
    deleteButton: {},
    editPage: {
      sections: []
    }
  },
  relations: [
    {
      type: 'n:1',
      relationalTable: 'images',
      foreignKey: 'ProductId',
      remoteTable: 'products'
    }
  ]
}