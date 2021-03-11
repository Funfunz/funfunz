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
      type: 'number',
      isPk: true
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'createdAt',
      type: 'string',
    },
    {
      name: 'updatedAt',
      type: 'string',
    }
  ],
}