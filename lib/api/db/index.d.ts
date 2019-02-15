import knex from 'knex';
declare class Database {
    db: knex | null;
    constructor();
    initDB(): void;
}
declare const database: Database;
export default database;
