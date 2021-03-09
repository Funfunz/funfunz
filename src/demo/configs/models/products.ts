export default {
  name: 'products',
  connector: 'mainDatabase',
  visible: true,
  properties: [
    {
      name: 'id',
      filterable: true,
      model: {
        type: 'number',
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
        entityPage: {
          searchable: true,
        },
        editField: {
          type: 'number'
        }
      }
    },
    {
      name: 'name',
      filterable: true,
      model: {
        type: 'string',
        allowNull: true
      },
      layout: {
        label: 'Name',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        entityPage: {
          searchable: true,
        },
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'color',
      filterable: true,
      model: {
        type: 'string',
        allowNull: true
      },
      layout: {
        label: 'Color',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        entityPage: {
          filterable: {
            type: 'string',
            inputType: 'select',
            content: [
              {
                label: 'Blue',
                value: 'Blue',
              },
              {
                label: 'Red',
                value: 'Red',
              },
              {
                label: 'Yellow',
                value: 'Yellow',
              }
            ]
          },
        },
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'type',
      filterable: true,
      model: {
        type: 'number',
        allowNull: true
      },
      layout: {
        label: 'Type',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        entityPage: {
          filterable: {
            type: 'number',
            inputType: 'select',
            content: [
              {
                label: 1,
                value: 1,
              },
              {
                label: 2,
                value: 2,
              },
              {
                label: 3,
                value: 3,
              },
            ]
          },
        },
        editField: {}
      }
    },
    {
      name: 'createdAt',
      filterable: true,
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'Type',
        visible: {
          entityPage: true,
          detail: true,
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
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'Type',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        editField: {
          type: 'date'
        }
      }
    },
    {
      name: 'FamilyId',
      filterable: true,
      model: {
        type: 'number',
        allowNull: true
      },
      layout: {
        label: 'FamilyId',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        editField: {
          type: 'number'
        }
      }
    },
    {
      name: 'active',
      filterable: true,
      model: {
        type: 'boolean',
        allowNull: true
      },
      layout: {
        label: 'Active',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        entityPage: {
          filterable: {
            inputType: 'checkbox',
            type: 'boolean',
            checked: true,
            unChecked: false,
          },
        },
        editField: {
          type: 'checkbox'
        }
      }
    }
  ],
  layout: {
    label: 'Products',
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
      relationalTable: 'products',
      foreignKey: 'FamilyId',
      remoteTable: 'families'
    },
    {
      type: '1:n',
      relationalTable: 'images',
      foreignKey: 'ProductId',
      remoteTable: 'images'
    }
  ]
}