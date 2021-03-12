export default {
  name: 'images',
  connector: 'mainDatabase',
  visible: true,
  relations: [
    {
      type: 'n:1',
      foreignKey: 'ProductId',
      remoteEntity: 'products'
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
      name: 'main',
      type: 'boolean',
    },
    {
      name: 'file',
      type: 'file',
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
      name: 'ProductId',
      type: 'number',
    }
  ],
}