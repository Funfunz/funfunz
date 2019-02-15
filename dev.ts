import config from './config.json'
import settings from './settings.json'
import index from './src/api/index'

index({
  config,
  settings
})