#!/usr/bin/env node
import { databaseTypes } from './configurationTypes'
import { parse } from './parser'
import { databaseQuestions, databaseTypeQuestion } from './questions'
import { deleteFolderRecursive, isEmptyFolder } from './utils'
import { prompt } from 'enquirer'
import minimist from 'minimist'
import path from 'path'

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
