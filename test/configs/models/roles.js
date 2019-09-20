export default {
  "name": "roles",
  "verbose": "Roles",
  "pk": ["id"],
  "relations": {
    "manyToMany": [
      {
        "verbose": "Users",
        "relationTable": "usersroles",
        "foreignKey": "roleId",
        "localId": "id",
        "remoteTable": "users",
        "remoteForeignKey": "userId",
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
      "name": "name",
      "verbose": "name",
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
    "read": ["all"],
    "write": ["all"],
    "delete": ["all"],
  }
}