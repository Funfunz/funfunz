export default {
  name: 'usersroles',
  connector: 'mainDatabase',
  visible: true,
  properties: [
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
      name: 'userId',
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
        label: 'UserId',
        listColumn: {},
        editField: {
          type: 'number'
        }
      }
    },
    {
      name: 'roleId',
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
        label: 'RoleId',
        listColumn: {},
        editField: {
          type: 'number'
        }
      }
    }
  ],
  layout: {
    label: 'Usersroles',
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
      relationalTable: 'usersroles',
      foreignKey: 'userId',
      remoteTable: 'users'
    },
    {
      type: 'n:1',
      relationalTable: 'usersroles',
      foreignKey: 'roleId',
      remoteTable: 'roles'
    }
  ]
}