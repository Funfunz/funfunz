export default {
  "name": "products",
  "verbose": "Products",
  "pk": "id",
  "searchFields": [
    "name",
    "color",
  ],
  "relations": {
    "manyToOne": {
      "images": "ProductId",
    },
  },
  "chips": [
    {
      "verbose": "color",
      "columns": [
        {
          "name": "color",
          "verbose": "standard"
        }
      ]
    }
  ],
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
      "name": "name",
      "verbose": "name",
      "type": "varchar(255)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true
    },
    {
      "name": "color",
      "verbose": "color",
      "type": "varchar(255)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true
    },
    {
      "name": "active",
      "verbose": "active",
      "type": "tinyint(1)",
      "allowNull": true,
      "visible": {
        "main": false,
        "detail": true
      },
      "editable": true
    },
    {
      "name": "type",
      "verbose": "type",
      "type": "smallint(5)",
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
    },
    {
      "name": "FamilyId",
      "verbose": "FamilyId",
      "type": "int(11)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "relation": {
        "type": "oneToMany",
        "table": "families",
        "key": "id",
        "display": "id"
      }
    }
  ],
  "visible": true,
  "roles": [
    "all"
  ]
}