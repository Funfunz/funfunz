export default {
  "name": "families",
  "verbose": "Families",
  "pk": ["id"],
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
      "editable": true
    },
    {
      "name": "order",
      "verbose": "order",
      "type": "int(11)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true
    },
    {
      "name": "imageUrl",
      "verbose": "imageUrl",
      "type": "varchar(255)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true
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
      "editable": true
    },
    {
      "name": "email",
      "verbose": "email",
      "type": "varchar(255)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true
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
    }
  ],
  "visible": true,
  "roles": {
    "read": ["all"],
    "write": ["all"]
  }
}