import { describeInfo, schemaInfo } from '@root/describeTable';
import { typeAnswers } from '@root/index';
export declare function generateSettings(DBData: Array<{
    schema: schemaInfo;
    describe: describeInfo;
}>): any;
export declare function generateConfig(answers: typeAnswers): void;
