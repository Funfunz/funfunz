import { IHookProps } from "../../../types/hooks"

interface IRequest {
  user?: {
    id: number
    roles?: Array<{ 
      id: number
      name: string
    }>
  }
}

export default {
  name: 'users',
  connector: 'mainDatabase',
  visible: true,
  relations: [
    {
      type: 'm:n',
      relationalTable: 'usersroles',
      foreignKey: 'userId',
      remoteTable: 'roles',
      remoteForeignKey: 'roleId',
    },
  ],
  properties: [
    {
      name: 'id',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: true
      },
      model: {
        type: 'number',
        allowNull: false,
        isPk: true
      },
      layout: {
        label: 'Id',
        listColumn: {},
        editField: {
          type: 'number'
        }
      }
    },
    {
      name: 'email',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'Email',
        listColumn: {},
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'name',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      model: {
        type: 'string',
        allowNull: true
      },
      layout: {
        label: 'Name',
        listColumn: {},
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'password',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      model: {
        type: 'string',
        allowNull: true
      },
      layout: {
        label: 'Password',
        listColumn: {},
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'createdAt',
      filterable: true,
      visible: {
        list: true,
        detail: false,
        relation: false
      },
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'CreatedAt',
        listColumn: {},
        editField: {
          type: 'date'
        }
      }
    },
    {
      name: 'updatedAt',
      filterable: true,
      visible: {
        list: true,
        detail: false,
        relation: false
      },
      model: {
        type: 'string',
        allowNull: false
      },
      layout: {
        label: 'UpdatedAt',
        listColumn: {},
        editField: {
          type: 'date'
        }
      }
    }
  ],
  hooks: {
    all: {
      async beforeResolver(props: IHookProps<unknown, unknown>) {
        if (!((props.requestContext as any).req as IRequest)?.user?.roles?.find(r => r.name === 'admin')) {
          throw new Error('Not authorized')
        }
        return props
      }
    }
  },
  layout: {
    label: 'Users',
    listPage: {},
    searchField: {},
    createButton: {},
    editButton: {},
    deleteButton: {},
    editPage: {
      sections: []
    }
  }
}