# SQL connector

This connector uses [KnexJS](http://knexjs.org/#Installation-client) under the hood and is able to connect to the following of SQL databases:
- Postgres
- MSSQL
- MySQL
- MariaDB
- SQLite3
- Oracle
- Amazon Redshift

The configuration supported for each of the databases can be checked at [KnexJS](http://knexjs.org/#Installation-client)

Also, when using this connector, you will need to install the required driver to each database you are using.

**Drivers required for each database**
- [pg](https://github.com/brianc/node-postgres) for PostgreSQL and Amazon Redshift
- [mysql](https://github.com/felixge/node-mysql) for MySQL or MariaDB
- [sqlite3](https://github.com/mapbox/node-sqlite3) for SQLite3
- [mssql](https://github.com/patriksimek/node-mssql) for MSSQL.

**MySQL config**

```js  
{
  host: string, // database host
  database: string, // database name
  user: string, // database user
  password: string, // database password
  ssl: boolean | SSLobject, // if ssl is needed
}
```