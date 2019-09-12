export default {
  "name": "users",
  "verbose": "Users",
  "pk": ["id"],
  "relations": {
    "manyToMany": [
      {
        "verbose": "Roles",
        "relationTable": "usersroles",
        "foreignKey": "userId",
        "localId": "id",
        "remoteTable": "roles",
        "remoteForeignKey": "roleId",
        "remoteId": "id"
      }
    ]
  },
  "columns": [
    {
      "name": "id",
      "verbose": "id",
      "type": "int(11)",
      "allowNull": false,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "number"
      }
    },
    {
      "name": "email",
      "verbose": "email",
      "type": "varchar(255)",
      "allowNull": false,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "text"
      }
    },
    {
      "name": "name",
      "verbose": "name",
      "type": "varchar(255)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "text"
      }
    },
    {
      "name": "password",
      "verbose": "password",
      "type": "varchar(255)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "text"
      }
    },
    {
      "name": "createdAt",
      "verbose": "createdAt",
      "type": "datetime",
      "allowNull": false,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "date"
      }
    },
    {
      "name": "updatedAt",
      "verbose": "updatedAt",
      "type": "datetime",
      "allowNull": false,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "date"
      }
    }
  ],
  "visible": true,
  "roles": {
    "read": ["admin"],
    "write": ["admin"]
  }
}
