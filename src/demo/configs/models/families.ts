export default {
  name: 'families',
  connector: 'mainDatabase',
  visible: true,
  'relations': [
    {
      'type': '1:n',
      'foreignKey': 'FamilyId',
      'remoteTable': 'products'
    }
  ],
  'properties': [
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
      'name': 'order',
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
        'label': 'Order',
        'listColumn': {},
        'editField': {
          'type': 'number'
        }
      }
    },
    {
      'name': 'imageUrl',
      'searchable': true,
      'model': {
        'type': 'varchar(255)',
        'allowNull': true
      },
      'layout': {
        'label': 'ImageUrl',
        'listColumn': {},
        'editField': {
          'type': 'text'
        }
      }
    },
    {
      'name': 'name',
      'searchable': true,
      'visible': {
        'list': true,
        'detail': true,
        'relation': false,
      },
      'model': {
        'type': 'varchar(255)',
        'allowNull': false
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
      'name': 'email',
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
        'label': 'Email',
        'listColumn': {},
        'editField': {
          'type': 'text'
        }
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
    }
  ],
  'layout': {
    'label': 'Families',
    'listPage': {},
    'searchField': {},
    'createButton': {},
    'editButton': {},
    'deleteButton': {},
    'editPage': {
      'sections': []
    }
  }
}