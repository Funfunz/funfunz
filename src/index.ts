// get the client
import { generateConfig, generateSettings } from '@root/configGenerator'
import describe from '@root/describeTable'
import getTableList from '@root/listTables'
import { prompt } from 'enquirer'
import fs from 'fs'

function deleteFolderRecursive(path: string) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

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
    deleteFolderRecursive('generatedConfigs')
    Promise.all([
      getTableList(),
      generateConfig(compiledAnswers),
    ]).then(
      ([tableNames]) => {
        describe(tableNames).then(
          (results) => {
            generateSettings(results)
          }
        )
      }
    )
  }
)
