export default {
  "name": "images",
  "visible": true,
  "roles": {
    "create": [
      "all"
    ],
    "read": [
      "all"
    ],
    "update": [
      "all"
    ],
    "delete": [
      "all"
    ]
  },
  "columns": [
    {
      "name": "id",
      "searchable": true,
      "visible": {
        "list": true,
        "detail": true,
        "relation": true
      },
      "model": {
        "type": "bigint",
        "allowNull": false,
        "isPk": true
      },
      "layout": {
        "label": "Id",
        "listColumn": {},
        "editField": {}
      }
    },
    {
      "name": "name",
      "searchable": true,
      "visible": {
        "list": true,
        "detail": true,
        "relation": false
      },
      "model": {
        "type": "varchar(255)",
        "allowNull": true
      },
      "layout": {
        "label": "Name",
        "listColumn": {},
        "editField": {
          "type": "text"
        }
      }
    },
    {
      "name": "main",
      "searchable": true,
      "visible": {
        "list": true,
        "detail": true,
        "relation": false
      },
      "model": {
        "type": "tinyint(1)",
        "allowNull": false
      },
      "layout": {
        "label": "Main",
        "listColumn": {},
        "editField": {
          "type": "checkbox"
        }
      }
    },
    {
      "name": "createdAt",
      "searchable": true,
      "visible": {
        "list": true,
        "detail": false,
        "relation": false
      },
      "model": {
        "type": "datetime",
        "allowNull": false
      },
      "layout": {
        "label": "CreatedAt",
        "listColumn": {},
        "editField": {
          "type": "date"
        }
      }
    },
    {
      "name": "updatedAt",
      "searchable": true,
      "visible": {
        "list": true,
        "detail": false,
        "relation": false
      },
      "model": {
        "type": "datetime",
        "allowNull": false
      },
      "layout": {
        "label": "UpdatedAt",
        "listColumn": {},
        "editField": {
          "type": "date"
        }
      }
    },
    {
      "name": "ProductId",
      "searchable": true,
      "visible": {
        "list": true,
        "detail": true,
        "relation": false
      },
      "model": {
        "type": "int",
        "allowNull": true
      },
      "layout": {
        "label": "ProductId",
        "listColumn": {},
        "editField": {
          "type": "number"
        }
      }
    }
  ],
  "layout": {
    "label": "Images",
    "listPage": {},
    "searchField": {},
    "createButton": {},
    "editButton": {},
    "deleteButton": {},
    "editPage": {
      "sections": []
    }
  },
  "relations": [
    {
      "type": "n:1",
      "relationalTable": "images",
      "foreignKey": "ProductId",
      "remoteTable": "products"
    }
  ]
}