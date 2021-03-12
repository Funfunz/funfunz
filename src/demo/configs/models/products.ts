export default {
  name: 'products',
  connector: 'mainDatabase',
  visible: true,
  relations: [
    {
      type: 'n:1',
      foreignKey: 'FamilyId',
      remoteEntity: 'families'
    },
    {
      type: '1:n',
      foreignKey: 'ProductId',
      remoteEntity: 'images'
    }
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
      name: 'color',
      type: 'string',
    },
    {
      name: 'type',
      type: 'number',
    },
    {
      name: 'createdAt',
      type: 'string',
    },
    {
      name: 'updatedAt',
      type: 'string',
    },
    {
      name: 'FamilyId',
      type: 'number',
    },
    {
      name: 'active',
      type: 'boolean',
    }
  ],
}