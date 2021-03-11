import { IHookProps } from '../../../types/hooks'

export default {
  name: 'families',
  connector: 'mainDatabase',
  visible: true,
  relations: [
    {
      type: '1:n',
      foreignKey: 'FamilyId',
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
      name: 'order',
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      type: 'number',
    },
    {
      name: 'imageUrl',
      type: 'string',
    },
    {
      name: 'name',
      visible: {
        'list': true,
        'detail': true,
        'relation': false,
      },
      type: 'string',
    },
    {
      name: 'email',
      visible: {
        list: true,
        detail: true,
        relation: false
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
  hooks: {
    count: {
      async afterQueryResult(props: IHookProps<unknown, unknown>) {
        props.results = 69
        return props
      }
    }
  },
}