import { IEntityInfo } from '../../generator/configurationTypes'
import familiesModel from './models/families'
import imagesModel from './models/images'
import productsModel from './models/products'
import rolesModel from './models/roles'
import usersModel from './models/users'
import usersrolesModel from './models/usersroles'

export default [
  familiesModel as IEntityInfo,
  imagesModel as IEntityInfo,
  productsModel as IEntityInfo,
  rolesModel as IEntityInfo,
  usersModel as IEntityInfo,
  usersrolesModel as IEntityInfo
]
