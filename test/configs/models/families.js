/* istanbul ignore file */
export default {
  "name": "families",
  "verbose": "Families",
  "pk": ["id"],
  "relations": {
    "manyToOne": {
      "products": [{
        "fk": "familyId",
        "target": "id",
      }],
    },
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
      "name": "order",
      "verbose": "order",
      "type": "int(11)",
      "allowNull": true,
      "visible": {
        "main": true,
        "detail": true
      },
      "editable": true,
      "input": {
        "type": "numbeer"
      }
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
      "editable": true,
      "input": {
        "type": "file"
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
      "name": "email",
      "verbose": "email",
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
    "read": ["all"],
    "write": ["all"],
    "delete": ["all"],
  }
}
