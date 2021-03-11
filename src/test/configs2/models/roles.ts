export default {
  name: 'roles',
  connector: 'mainDatabase',
  visible: false,
  relations: [
    {
      type: 'm:n',
      relationalEntity: 'usersroles',
      foreignKey: 'roleId',
      remoteEntity: 'users',
      remoteForeignKey: 'userId',
    },
  ],
  properties: [
    {
      name: 'id',
      visible: {
        list: true,
        detail: true,
        relation: true
      },
      type: 'number',
      isPk: true
    },
    {
      name: 'name',
      visible: {
        list: true,
        detail: true,
        relation: true,
      },
      type: 'string',
    },
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
    }
  ],
}