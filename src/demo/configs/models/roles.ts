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
      name: 'name',
      filterable: true,
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'Name',
        visible: {
          entityPage: true,
          detail: true,
          relation: true,
        },
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