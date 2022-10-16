import { generateConfig, generateSettings } from './configGenerator.js'
import { databaseTypes } from './configurationTypes.js'

export function parse(answers: Record<string, unknown>, databaseType: databaseTypes, selectedPath: string): Promise<void> {
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
