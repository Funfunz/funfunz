import { Validator } from 'jsonschema'
import settingsSchema from '@root/api/utils/settingsSchema'
import configSchema from '@root/api/utils/configSchema'

let config: {
  settings: Array<any>,
  config: any,
  [key: string]: any,
} = {
  settings: [],
  config: {}
}

export function setConfig (configs: any, target: string) {
  if (configCheck(configs, target)) {
    config[target] = configs
  }
}

function configCheck (configs: any, target: string) {
  const validator = new Validator();

  if (!configs) {
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

export default function () {
  return config
}