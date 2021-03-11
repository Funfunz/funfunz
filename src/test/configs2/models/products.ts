import { IHookProps } from "../../../types/hooks"

export default {
  name: 'products',
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
      name: 'color',
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      type: 'string',
    },
    {
      name: 'type',
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      type: 'number',
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
      name: 'FamilyId',
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      type: 'number',
    },
    {
      name: 'active',
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      type: 'boolean',
    }
  ],
  hooks: {
    count: {
      async beforeResolver(props: IHookProps<unknown, unknown>) {
        props.args.filter =  { id: { _eq: 1 }}
        return props
      }
    }
  },
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
  ]
}