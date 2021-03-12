import { IEntityInfo } from '../../../generator/configurationTypes'
import { Funfunz } from '../../../middleware'

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
    all: {
      async beforeResolver(props) {
        console.log(props.schemaOptions.context)
        if (!props.schemaOptions.isLocal) {
          console.log(await Funfunz.executeGraphQL(props.graph.local, 'query families { id }'))
        }
        return props
      }
    }
  }
} as IEntityInfo