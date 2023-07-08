import { IEntityInfo } from '../../generator/configurationTypes.js'
import familiesModel from './models/families.js'
import imagesModel from './models/images.js'
import productsModel from './models/products.js'
import rolesModel from './models/roles.js'
import usersModel from './models/users.js'
import usersrolesModel from './models/usersroles.js'

export default [
  familiesModel as IEntityInfo,
  imagesModel as IEntityInfo,
  productsModel as IEntityInfo,
  rolesModel as IEntityInfo,
  usersModel as IEntityInfo,
  usersrolesModel as IEntityInfo
]
