import configSchema from '../../types/configSchema'
import entitiesSchema from '../../types/entitiesSchema'
import type { IConfig, IEntityInfo } from '../../generator/configurationTypes'
import { Validator } from 'jsonschema'
import { IFunfunzConfig } from '../types'

const config: IFunfunzConfig = {
  entities: [],
  config: {
    connectors: {},
  },
}

export function setConfig(configs: IConfig | IEntityInfo[], target: string): void {
  if (configCheck(configs, target)) {
    config[target] = configs
  }
}

function configCheck(configs: unknown, target: string) {
  const validator = new Validator()

  if (configs === undefined) {
    throw new Error('Configuration is missing')
  }
  if (target === 'settings') {
    const validation = validator.validate(configs, entitiesSchema)
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

export default function(): IFunfunzConfig {
  return config
}
