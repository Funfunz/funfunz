export default {
  name: 'images',
  connector: 'mainDatabase',
  visible: true,
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
        relation: false
      },
      type: 'string',
    },
    {
      name: 'main',
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      type: 'boolean',
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
    },
    {
      name: 'ProductId',
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      type: 'number',
    }
  ],
  relations: [
    {
      type: 'n:1',
      foreignKey: 'ProductId',
      remoteEntity: 'products'
    }
  ]
}