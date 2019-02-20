import { describeInfo, schemaInfo } from '@root/describeTable';
import { ITypeAnswers } from '@root/index';
export declare function generateSettings(DBData: Array<{
    schema: schemaInfo;
    describe: describeInfo;
}>): any;
export declare function generateConfig(answers: ITypeAnswers): void;
