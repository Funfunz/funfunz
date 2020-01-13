#!/usr/bin/env node

// get the client
import { generateConfig, generateSettings } from '@root/generator/configGenerator'
import { databaseQuestions, databaseTypeQuestion } from '@root/generator/questions'
import { prompt } from 'enquirer'
import fs from 'fs'
import minimist from 'minimist'
import path from 'path'

export function deleteFolderRecursive(pathSelected: string) {
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

export function isEmptyFolder(pathSelected: string) {
  if (fs.existsSync(pathSelected)) {
    return fs.readdirSync(pathSelected).length <= 0
  }
  return true
}

function parse(answers: any, databaseType: databaseTypes, selectedPath: string) {
  return import('./' + databaseType).then(
    (dbModule) => {
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
        dbModule.default(),
        generateConfig(
          {
            ...compiledAnswers,
            DBType: databaseType,
          },
          selectedPath
        ),
      ]).then(
        ([results]) => {
          generateSettings(results, selectedPath)
        }
      )
    }
  )
}

function promptUserAboutDatabase(selectedPath: string) {
  prompt(databaseTypeQuestion).then(
    (answers: any) => {
      const databaseType: databaseTypes = answers.DBType

      switch (databaseType) {
        case 'pgsql':
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
          throw Error('Parser for ' + databaseType + ' not yet integrated')
        case 'mysql':
        case 'mongoDB':
          return parse(answers, databaseType, selectedPath)
      }
    }
  ).catch(
    (error: Error) => {
      console.log(error.message)
    }
  )
}

function promptUserToDeleteFolder(selectedPath: string) {
  return prompt({
    type: 'confirm',
    name: 'delete',
    message: 'The target folder is not empty, do you want to clear its contents?',
  }).then(
    (answers: any) => {
      if (answers && answers.delete) {
        deleteFolderRecursive(selectedPath)
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

const argv = minimist(process.argv.slice(2))
const userSelectedPath = path.join(process.cwd(),  argv._[0] || '/generatedConfigs')

if (process.env.NODE_ENV !== 'test') {
  if (isEmptyFolder(userSelectedPath)) {
    promptUserAboutDatabase(userSelectedPath)
  } else {
    promptUserToDeleteFolder(userSelectedPath).then(
      () => {
        promptUserAboutDatabase(userSelectedPath)
      }
    )
  }
}

export { parse }
