import { generateConfig, generateSettings } from '@root/generator/configGenerator'
import { databaseTypes } from '@root/generator/configurationTypes'

export function parse(answers: any, databaseType: databaseTypes, selectedPath: string) {
  return import('./' + databaseType).then(
    (dbModule) => {
      return Promise.all([
        dbModule.default(answers),
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
