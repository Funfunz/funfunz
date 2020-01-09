/* istanbul ignore file */
export default {
  "name": "products",
  "verbose": "Products",
  "pk": ["id"],
  "searchFields": [
    "name",
    "color",
  ],
  "relations": {
    "manyToOne": {
      "images": [{
        "fk": "ProductId",
        "target": "id"
      }],
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
      "name": "color",
      "verbose": "color",
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
      "name": "active",
      "verbose": "active",
      "type": "tinyint(1)",
      "allowNull": true,
      "visible": {
        "main": false,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "checkbox"
      }
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
      "editable": true,
      "input": {
        "type": "number"
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
      "name": "FamilyId",
      "verbose": "FamilyId",
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
        "table": "families",
        "key": "id",
        "display": "id"
      }
    }
  ],
  "visible": true,
  "roles": {
    "read": ["unauthenticated"],
    "write": ["unauthenticated"],
    "delete": ["unauthenticated"],
  }
}
