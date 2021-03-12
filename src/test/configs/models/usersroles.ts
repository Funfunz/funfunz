export default {
  name: 'usersroles',
  connector: 'mainDatabase',
  visible: true,
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
  ],
  properties: [
    {
      name: 'createdAt',
      type: 'string',
    },
    {
      name: 'updatedAt',
      type: 'string',
    },
    {
      name: 'userId',
      type: 'number',
      isPk: true
    },
    {
      name: 'roleId',
      type: 'number',
      isPk: true
    }
  ],
}