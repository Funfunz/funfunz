export default {
  name: 'users',
  connector: 'mainDatabase',
  visible: true,
  relations: [
    {
      type: 'm:n',
      relationalEntity: 'usersroles',
      foreignKey: 'userId',
      remoteEntity: 'roles',
      remoteForeignKey: 'roleId',
    },
  ],
  properties: [
    {
      name: 'id',
      type: 'number',
      isPk: true
    },
    {
      name: 'email',
      type: 'string',
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'password',
      visible: false,
      filterable: false,
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