import configSchema from '@root/api/utils/configSchema'
import settingsSchema from '@root/api/utils/settingsSchema'
import { ITableInfo } from '@root/generator/configGenerator'
import { Validator } from 'jsonschema'

const config: {
  settings: ITableInfo[],
  config: any,
  [key: string]: any,
} = {
  settings: [],
  config: {},
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

export function setConfig(configs: any, target: string) {
  if (configCheck(configs, target)) {
    if (configs.server && configs.server.port) {
      configs.server.port = normalizePort(configs.server.port)
    }
    if (target === 'settings') {
      configs.forEach(
        (table: ITableInfo) => {
          table.roles.read = Array.from(new Set<string>([...table.roles.read, ...table.roles.write]))
        }
      )
    }
    config[target] = configs
  }
}

function configCheck(configs: any, target: string) {
  const validator = new Validator();

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

export default function() {
  return config
}
