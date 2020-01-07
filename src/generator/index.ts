#!/usr/bin/env node

// get the client
import { generateConfig, generateSettings } from '@root/generator/configGenerator'
import describe from '@root/generator/describeTable'
import getTableList from '@root/generator/listTables'
import { prompt } from 'enquirer'
import fs from 'fs'
import minimist from 'minimist'
import path from 'path'

const argv = minimist(process.argv.slice(2))
const userSelectedPath = path.join(process.cwd(),  argv._[0] || '/generatedConfigs')

function deleteFolderRecursive(pathSelected: string) {
  if (fs.existsSync(pathSelected)) {
    fs.readdirSync(pathSelected).forEach((file) => {
      const curPath = pathSelected + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    if (pathSelected.split('/').pop() !== '.') {
      fs.rmdirSync(pathSelected)
    }
  }
}

function isEmptyFolder(pathSelected: string) {
  if (fs.existsSync(pathSelected)) {
    return fs.readdirSync(pathSelected).length <= 0
  }
  return true
}

function promptUserAboutDatabase() {
  prompt(databaseQuestions).then(
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
}

function promptUserToDeleteFolder() {
  return prompt({
    type: 'confirm',
    name: 'delete',
    message: 'The target folder is not empty, do you want to clear its contents?',
  }).then(
    (answers: any) => {
      if (answers && answers.delete) {
        deleteFolderRecursive(userSelectedPath)
      } else {
        throw Error('Target folder needs to be empty')
      }
    }
  )
}

export interface ITypeAnswers {
  DBType: string,
  DBHost: string,
  DBName: string,
  DBUser: string,
  DBPassword: string
}

const databaseQuestions = [
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

if (isEmptyFolder(userSelectedPath)) {
  promptUserAboutDatabase()
} else {
  promptUserToDeleteFolder().then(
    () => {
      promptUserAboutDatabase()
    }
  )
}
