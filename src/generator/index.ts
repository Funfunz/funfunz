#!/usr/bin/env node

// get the client
import { generateConfig, generateSettings } from '@root/generator/configGenerator'
import describe from '@root/generator/describeTable'
import getTableList from '@root/generator/listTables'
import { databaseQuestions, databaseTypeQuestion } from '@root/generator/questions'
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

function parseMysql(answers: any) {
  const compiledAnswers: ITypeAnswers = {
    DBHost: answers.DBHost,
    DBName: answers.DBName,
    DBUser: answers.DBUser,
    DBPassword: answers.DBPassword,
  }

  process.env = {
    ...process.env,
    ...compiledAnswers,
  }
  return Promise.all([
    getTableList(),
    generateConfig({
      ...compiledAnswers,
      DBType: 'mysql',
    }),
  ]).then(
    ([tableNames]) => {
      return describe(tableNames)
    }
  ).then(
    (results) => {
      generateSettings(results)
    }
  )
}

function promptUserAboutDatabase() {
  prompt(databaseTypeQuestion).then(
    (answers: any) => {
      const databaseType: databaseTypes = answers.DBType

      switch (databaseType) {
        case 'pgsql':
        case 'mongoDB':
          throw Error('Database not yet supported')
        default:
          return Promise.all([
            prompt(databaseQuestions[databaseType]),
            databaseType,
          ])
      }
    }
  ).then(
    ([answers, databaseType]: [any, databaseTypes]) => {
      switch (databaseType) {
        case 'pgsql':
        case 'mongoDB':
          throw Error('Parser for ' + databaseType + ' not yet integrated')
        case 'mysql':
          return parseMysql(answers)
      }
    }
  ).catch(
    (error: Error) => {
      console.log(error.message)
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
  DBHost: string,
  DBName: string,
  DBUser: string,
  DBPassword: string
}

type databaseTypes = 'mysql' | 'pgsql' | 'mongoDB'

if (isEmptyFolder(userSelectedPath)) {
  promptUserAboutDatabase()
} else {
  promptUserToDeleteFolder().then(
    () => {
      promptUserAboutDatabase()
    }
  )
}
