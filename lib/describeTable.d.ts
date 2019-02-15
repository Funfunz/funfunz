export declare type describeInfo = Array<{
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: string | number | null;
    Extra: string;
}>;
export declare type schemaInfo = Array<{
    TABLE_NAME: string;
    COLUMN_NAME?: string;
    CONSTRAINT_NAME?: string;
    REFERENCED_TABLE_NAME?: string;
    REFERENCED_COLUMN_NAME?: string;
}>;
declare const describe: (tablesNames: string[]) => PromiseLike<{
    schema: {
        TABLE_NAME: string;
        COLUMN_NAME?: string | undefined;
        CONSTRAINT_NAME?: string | undefined;
        REFERENCED_TABLE_NAME?: string | undefined;
        REFERENCED_COLUMN_NAME?: string | undefined;
    }[];
    describe: {
        Field: string;
        Type: string;
        Null: string;
        Key: string;
        Default: string | number | null;
        Extra: string;
    }[];
}[]>;
export default describe;
