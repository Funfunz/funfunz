export default {
  "name": "usersroles",
  "visible": true,
  "roles": {
    "create": [
      "admin"
    ],
    "read": [
      "admin"
    ],
    "update": [
      "admin"
    ],
    "delete": [
      "admin"
    ]
  },
  "columns": [
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
      "name": "userId",
      "searchable": true,
      "visible": {
        "list": true,
        "detail": true,
        "relation": true
      },
      "model": {
        "type": "int",
        "allowNull": false,
        "isPk": true
      },
      "layout": {
        "label": "UserId",
        "listColumn": {},
        "editField": {
          "type": "number"
        }
      }
    },
    {
      "name": "roleId",
      "searchable": true,
      "visible": {
        "list": true,
        "detail": true,
        "relation": true
      },
      "model": {
        "type": "int",
        "allowNull": false,
        "isPk": true
      },
      "layout": {
        "label": "RoleId",
        "listColumn": {},
        "editField": {
          "type": "number"
        }
      }
    }
  ],
  "layout": {
    "label": "Usersroles",
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
      "relationalTable": "usersroles",
      "foreignKey": "userId",
      "remoteTable": "users"
    },
    {
      "type": "n:1",
      "relationalTable": "usersroles",
      "foreignKey": "roleId",
      "remoteTable": "roles"
    }
  ]
}