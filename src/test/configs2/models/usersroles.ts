export default {
  name: 'usersroles',
  connector: 'mainDatabase',
  visible: true,
  properties: [
    {
      name: 'createdAt',
      visible: {
        list: true,
        detail: false,
        relation: false
      },
      type: 'string',
    },
    {
      name: 'updatedAt',
      visible: {
        list: true,
        detail: false,
        relation: false
      },
      type: 'string',
    },
    {
      name: 'userId',
      isPk: true,
      visible: {
        list: true,
        detail: true,
        relation: true
      },
      type: 'number',
    },
    {
      name: 'roleId',
      isPk: true,
      visible: {
        list: true,
        detail: true,
        relation: true
      },
      type: 'number',
    }
  ],
  relations: [
    {
      type: 'n:1',
      relationalEntity: 'usersroles',
      foreignKey: 'userId',
      remoteEntity: 'users'
    },
    {
      type: 'n:1',
      relationalEntity: 'usersroles',
      foreignKey: 'roleId',
      remoteEntity: 'roles'
    }
  ]
}