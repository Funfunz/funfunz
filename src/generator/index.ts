#!/usr/bin/env node
import { databaseTypes } from './configurationTypes.js'
import { parse } from './parser.js'
import { databaseQuestions, databaseTypeQuestion } from './questions.js'
import { deleteFolderRecursive, isEmptyFolder } from './utils.js'
import { prompt } from 'enquirer'
import minimist from 'minimist'
import path from 'path'

function promptUserAboutDatabase(selectedPath: string) {
  prompt<Record<string, string>>(databaseTypeQuestion).then(
    (answers) => {
      const databaseType: databaseTypes = answers.DBType as databaseTypes

      switch (databaseType) {
      case 'pgsql':
        throw Error('Database not yet supported')
      default:
        return Promise.all([
          prompt<Record<string, string>>(databaseQuestions[databaseType]),
          databaseType,
        ])
      }
    }
  ).then(
    ([answers, databaseType]) => {
      switch (databaseType) {
      case 'mysql':
      case 'mongoDB':
        return parse(answers, databaseType, selectedPath)
      }
    }
  ).catch(
    (error: Error) => {
      console.error(error.message)
    }
  )
}

function promptUserToDeleteFolder(selectedPath: string) {
  return prompt<Record<string, string>>({
    type: 'confirm',
    name: 'delete',
    message: 'The target folder is not empty, do you want to clear its contents?',
  }).then(
    (answers) => {
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
