export default {
  "name": "images",
  "verbose": "Images",
  "pk": ["id"],
  "columns": [
    {
      "name": "id",
      "verbose": "id",
      "type": "bigint(20)",
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
      "name": "main",
      "verbose": "main",
      "type": "tinyint(1)",
      "allowNull": false,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "checkbox"
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
    },
    {
      "name": "ProductId",
      "verbose": "ProductId",
      "type": "int(11)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "number"
      },
      "relation": {
        "type": "oneToMany",
        "table": "products",
        "key": "id",
        "display": "id"
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
