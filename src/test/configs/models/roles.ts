export default {
  name: 'roles',
  connector: 'mainDatabase',
  visible: false,
  relations: [
    {
      type: 'm:n',
      relationalTable: 'usersroles',
      foreignKey: 'roleId',
      remoteTable: 'users',
      remoteForeignKey: 'userId',
    },
  ],
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
        editField: {
          type: 'number'
        }
      }
    },
    {
      name: 'name',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: true,
      },
      model: {
        type: 'string',
        allowNull: false
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
    }
  ],
  layout: {
    label: 'Roles',
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