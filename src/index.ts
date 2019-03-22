// get the client
import { generateConfig, generateSettings } from '@root/configGenerator'
import describe from '@root/describeTable'
import tables from '@root/listTables'
import { prompt } from 'enquirer'

export interface ITypeAnswers {
  DBType: string,
  DBHost: string,
  DBName: string,
  DBUser: string,
  DBPassword: string
}

const question = [
  {
    type: 'select',
    name: 'DBType',
    message: 'What is your database?',
    limit: 5,
    choices: [
      'mysql',
      'pgsql',
      'mongoDB',
    ],
  },
  {
    type: 'input',
    name: 'DBHost',
    message: 'Database hostname?',
    initial: 'localhost',
  },
  {
    type: 'input',
    name: 'DBName',
    message: 'Database name?',
    initial: 'example_database',
  },
  {
    type: 'input',
    name: 'DBUser',
    message: 'Database user?',
    initial: 'root',
  },
  {
    type: 'password',
    name: 'DBPassword',
    message: 'Database password?',
    initial: '',
  },
];

prompt(question).then(
  (answers: any) => {
    const compiledAnswers: ITypeAnswers = {
      DBType: answers.DBType,
      DBHost: answers.DBHost,
      DBName: answers.DBName,
      DBUser: answers.DBUser,
      DBPassword: answers.DBPassword,
    }

    process.env = {
      ...process.env,
      ...compiledAnswers,
    }
    Promise.all([
      generateConfig(compiledAnswers),
      tables(),
    ]).then(
      ([config, tablesNames]) => {
        describe(tablesNames).then(
          (results) => {
            console.log(results)
            generateSettings(results)
          }
        )
      }
    )
  }
)
