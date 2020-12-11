export default {
  name: 'images',
  connector: 'mainDatabase',
  visible: true,
  properties: [
    {
      name: 'id',
      filterable: true,
      model: {
        type: 'bigint',
        allowNull: false,
        isPk: true
      },
      layout: {
        label: 'Id',
        visible: {
          entityPage: true,
          detail: true,
          relation: true
        },
        editField: {}
      }
    },
    {
      name: 'name',
      filterable: true,
      model: {
        type: 'varchar(255)',
        allowNull: true
      },
      layout: {
        label: 'Name',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'main',
      filterable: true,
      model: {
        type: 'tinyint(1)',
        allowNull: false
      },
      layout: {
        label: 'Main',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        editField: {
          type: 'checkbox'
        }
      }
    },
    {
      name: 'createdAt',
      filterable: true,
      model: {
        type: 'datetime',
        allowNull: false
      },
      layout: {
        label: 'CreatedAt',
        visible: {
          entityPage: true,
          detail: false,
          relation: false
        },
        editField: {
          type: 'date'
        }
      }
    },
    {
      name: 'updatedAt',
      filterable: true,
      model: {
        type: 'datetime',
        allowNull: false
      },
      layout: {
        label: 'UpdatedAt',
        visible: {
          entityPage: true,
          detail: false,
          relation: false
        },
        editField: {
          type: 'date'
        }
      }
    },
    {
      name: 'ProductId',
      filterable: true,
      model: {
        type: 'int',
        allowNull: true
      },
      layout: {
        label: 'ProductId',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
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