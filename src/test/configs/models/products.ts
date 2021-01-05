import { IHookProps } from "../../../types/hooks"

export default {
  'name': 'products',
  'connector': 'mainDatabase',
  'visible': true,
  'properties': [
    {
      'name': 'id',
      'filterable': true,
      'visible': {
        'list': true,
        'detail': true,
        'relation': true
      },
      'model': {
        'type': 'int',
        'allowNull': false,
        'isPk': true
      },
      'layout': {
        'label': 'Id',
        'listColumn': {},
        'editField': {
          'type': 'number'
        }
      }
    },
    {
      'name': 'name',
      'filterable': true,
      'visible': {
        'list': true,
        'detail': true,
        'relation': false
      },
      'model': {
        'type': 'varchar(255)',
        'allowNull': true
      },
      'layout': {
        'label': 'Name',
        'listColumn': {},
        'editField': {
          'type': 'text'
        }
      }
    },
    {
      name: 'color',
      filterable: true,
      visible: {
        list: true,
        detail: true,
        relation: false
      },
      model: {
        type: 'varchar(255)',
        allowNull: true
      },
      layout: {
        label: 'Color',
        entityPage: {
          filterable: {
            type: 'enum',
            content: ['Blue', 'Red', 'Yellow']
          },
        },
        editField: {
          type: 'text'
        }
      }
    },
    {
      name: 'type',
      filterable: true,
      visible: {
        'list': true,
        'detail': true,
        'relation': false
      },
      'model': {
        'type': 'smallint',
        'allowNull': true
      },
      'layout': {
        'label': 'Type',
        'listColumn': {},
        'editField': {}
      }
    },
    {
      'name': 'createdAt',
      'filterable': true,
      'visible': {
        'list': true,
        'detail': false,
        'relation': false
      },
      'model': {
        'type': 'datetime',
        'allowNull': false
      },
      'layout': {
        'label': 'CreatedAt',
        'listColumn': {},
        'editField': {
          'type': 'date'
        }
      }
    },
    {
      'name': 'updatedAt',
      'filterable': true,
      'visible': {
        'list': true,
        'detail': false,
        'relation': false
      },
      'model': {
        'type': 'datetime',
        'allowNull': false
      },
      'layout': {
        'label': 'UpdatedAt',
        'listColumn': {},
        'editField': {
          'type': 'date'
        }
      }
    },
    {
      'name': 'FamilyId',
      'filterable': true,
      'visible': {
        'list': true,
        'detail': true,
        'relation': false
      },
      'model': {
        'type': 'int',
        'allowNull': true
      },
      'layout': {
        'label': 'FamilyId',
        'listColumn': {},
        'editField': {
          'type': 'number'
        }
      }
    },
    {
      'name': 'active',
      'filterable': true,
      'visible': {
        'list': true,
        'detail': true,
        'relation': false
      },
      'model': {
        'type': 'tinyint(1)',
        'allowNull': true
      },
      'layout': {
        'label': 'Active',
        'listColumn': {},
        'editField': {
          'type': 'checkbox'
        }
      }
    }
  ],
  'layout': {
    'label': 'Products',
    'listPage': {},
    'searchField': {},
    'createButton': {},
    'editButton': {},
    'deleteButton': {},
    'editPage': {
      'sections': []
    }
  },
  'hooks': {
    count: {
      async beforeResolver(props: IHookProps<unknown>) {
        props.args.filter =  { id: { _eq: 1 }}
        return props
      }
    }
  },
  'relations': [
    {
      'type': 'n:1',
      'relationalTable': 'products',
      'foreignKey': 'FamilyId',
      'remoteTable': 'families'
    },
    {
      'type': '1:n',
      'relationalTable': 'images',
      'foreignKey': 'ProductId',
      'remoteTable': 'images'
    }
  ]
}