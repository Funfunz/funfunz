import configSchema from '../../types/configSchema'
import settingsSchema from '../../types/settingsSchema'
import { IConfig, ITableInfo } from '../../generator/configurationTypes'
import { Validator } from 'jsonschema'

type FunfunzConfig = {
  settings: ITableInfo[],
  config: IConfig,
  [key: string]: unknown,
}

const config: FunfunzConfig = {
  settings: [],
  config: {
    connectors: {},
  },
}

export function setConfig(configs: IConfig | ITableInfo[], target: string): void {
  if (configCheck(configs, target)) {
    if (target === 'settings') {
      (configs as ITableInfo[]).forEach(
        (table) => {
          table.roles.read = Array.from(new Set<string>([...table.roles.read, ...table.roles.update]))
        }
      )
    }
    config[target] = configs
  }
}

function configCheck(configs: unknown, target: string) {
  const validator = new Validator()

  if (configs === undefined) {
    throw new Error('Configuration is missing')
  }
  if (target === 'settings') {
    const validation = validator.validate(configs, settingsSchema)
    if (validation.errors.length > 0) {
      throw new Error(validation.errors.toString())
    }
  }
  if (target === 'config') {
    const validation = validator.validate(configs, configSchema)
    if (validation.errors.length > 0) {
      throw new Error(validation.errors.toString())
    }
  }
  return true
}

export default function(): FunfunzConfig {
  return config
}
