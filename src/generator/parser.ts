import { generateConfig, generateSettings } from '@root/generator/configGenerator'
import { databaseTypes } from '@root/generator/configurationTypes'

export function parse(answers: any, databaseType: databaseTypes, selectedPath: string) {
  return import('./' + databaseType).then(
    (dbModule) => {
      process.env = {
        ...process.env,
        ...answers,
      }
      return Promise.all([
        dbModule.default(),
        generateConfig(
          {
            ...answers,
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
