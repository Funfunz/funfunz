import { IHookProps } from "../../../types"

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
    },
    {
      name: 'price',
      type: 'float',
    },
  ],
  hooks: {
    count: {
      async beforeResolver(props: IHookProps<unknown, unknown>) {
        props.args.filter =  { id: { _eq: 1 }}
        return props
      }
    }
  }
}