import { IEntityInfo } from '../../../generator/configurationTypes.js'
import { IHookProps } from '../../../types/index.js'

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
      type: 'number',
    },
    {
      name: 'imageUrl',
      type: 'string',
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'email',
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
  hooks: {
    count: {
      async afterQueryResult(props: IHookProps<unknown, unknown>) {
        props.results = 69
        return props
      }
    }
  }
} as IEntityInfo