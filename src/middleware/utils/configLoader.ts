import configSchema from '../../types/configSchema.js'
import entitiesSchema from '../../types/entitiesSchema.js'
import type { IConfig, IEntityInfo } from './configurationTypes.js'
import { Validator } from 'jsonschema'
import { IFunfunzConfig } from '../types.js'

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
