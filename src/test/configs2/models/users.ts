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
      relationalEntity: 'usersroles',
      foreignKey: 'userId',
      remoteEntity: 'roles',
      remoteForeignKey: 'roleId',
    },
  ],
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
      name: 'email',
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      type: 'string',
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
      name: 'password',
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
    all: {
      async beforeResolver(props: IHookProps<unknown, unknown>) {
        if (!((props.requestContext as any).req as IRequest)?.user?.roles?.find(r => r.name === 'admin')) {
          throw new Error('Not authorized')
        }
        return props
      }
    }
  },
}