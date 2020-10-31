export default {
  'name': 'products',
  'visible': true,
  'roles': {
    'create': [
      'unauthenticated'
    ],
    'read': [
      'unauthenticated'
    ],
    'update': [
      'unauthenticated'
    ],
    'delete': [
      'unauthenticated'
    ]
  },
  'columns': [
    {
      'name': 'id',
      'searchable': true,
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
      'searchable': true,
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
      'name': 'color',
      'searchable': true,
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
        'label': 'Color',
        'listColumn': {},
        'editField': {
          'type': 'text'
        }
      }
    },
    {
      'name': 'type',
      'searchable': true,
      'visible': {
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
      'searchable': true,
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
      'searchable': true,
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
      'searchable': true,
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
      'searchable': true,
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