export default {
  name: 'usersroles',
  connector: 'mainDatabase',
  visible: true,
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
  ],
  properties: [
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
      name: 'userId',
      filterable: true,
      model: {
        type: 'int',
        allowNull: false,
        'isPk': true
      },
      layout: {
        label: 'UserId',
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
      name: 'roleId',
      filterable: true,
      model: {
        type: 'int',
        allowNull: false,
        'isPk': true
      },
      layout: {
        label: 'RoleId',
        visible: {
          entityPage: true,
          detail: true,
          relation: true
        },
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
  }
}