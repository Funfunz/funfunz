export default {
  name: 'users',
  connector: 'mainDatabase',
  visible: true,
  relations: [
    {
      type: 'm:n',
      relationalTable: 'usersroles',
      foreignKey: 'userId',
      remoteTable: 'roles',
      remoteForeignKey: 'roleId',
    },
  ],
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
        editField: {
          type: 'number'
        }
      }
    },
    {
      name: 'email',
      filterable: true,
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'Email',
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
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'password',
      filterable: false,
      visible: false,
      model: {
        type: 'string',
        allowNull: true
      },
      layout: {
        label: 'Password',
        editField: {
          type: 'text'
        }
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
        type: 'string',
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
    }
  ],
  layout: {
    label: 'Users',
    listPage: {},
    searchField: {},
    createButton: {},
    editButton: {},
    deleteButton: {},
    editPage: {
      sections: []
    }
  }
}