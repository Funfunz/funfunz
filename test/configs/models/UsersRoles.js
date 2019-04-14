export default {
  "name": "UsersRoles",
  "verbose": "UsersRoles",
  "pk": "roleId",
  "columns": [
    {
      "name": "createdAt",
      "verbose": "createdAt",
      "type": "datetime",
      "allowNull": false,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true
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
      "editable": true
    },
    {
      "name": "userId",
      "verbose": "userId",
      "type": "int(11)",
      "allowNull": false,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "relation": {
        "type": "oneToMany",
        "table": "users",
        "key": "id",
        "display": "id"
      }
    },
    {
      "name": "roleId",
      "verbose": "roleId",
      "type": "int(11)",
      "allowNull": false,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "relation": {
        "type": "oneToMany",
        "table": "roles",
        "key": "id",
        "display": "id"
      }
    }
  ],
  "visible": false,
  "roles": [
    "all"
  ]
}