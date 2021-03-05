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
      remoteTable: 'products'
    }
  ],
  properties: [
    {
      name: 'id',
      filterable: true,
      model: {
        type: 'number',
        allowNull: false,
        isPk: true
      },
      layout: {
        label: 'Id',
        visible: {
          entityPage: true,
          detail: true,
          relation: true
        },
        editField: {
          type: 'number'
        }
      }
    },
    {
      name: 'order',
      filterable: true,
      model: {
        type: 'number',
        allowNull: true
      },
      layout: {
        label: 'Order',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        editField: {
          type: 'number'
        }
      }
    },
    {
      name: 'imageUrl',
      filterable: true,
      model: {
        type: 'string',
        allowNull: true
      },
      layout: {
        label: 'ImageUrl',
        visible: {
          entityPage: false,
          detail: true,
          relation: false,
        },
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'name',
      filterable: true,
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'Name',
        visible: {
          entityPage: true,
          detail: true,
          relation: false,
        },
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'email',
      filterable: true,
      model: {
        type: 'string',
        allowNull: true
      },
      layout: {
        label: 'Email',
        visible: {
          entityPage: true,
          detail: true,
          relation: false
        },
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'createdAt',
      filterable: true,
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'CreatedAt',
        visible: {
          entityPage: true,
          detail: false,
          relation: false
        },
        editField: {
          type: 'date'
        }
      }
    },
    {
      name: 'updatedAt',
      filterable: true,
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'UpdatedAt',
        visible: {
          entityPage: true,
          detail: false,
          relation: false
        },
        editField: {
          type: 'date'
        }
      }
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
  },
  layout: {
    label: 'Families',
    listPage: {},
    searchField: {},
    createButton: {},
    editButton: {},
    deleteButton: {},
    editPage: {
      sections: []
    }
  }
} as IEntityInfo