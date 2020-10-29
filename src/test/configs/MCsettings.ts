import { ITableInfo } from '../../generator/configurationTypes'
import familiesModel from './models/families'
import imagesModel from './models/images'
import productsModel from './models/products'
import rolesModel from './models/roles'
import usersModel from './models/users'
import usersrolesModel from './models/usersroles'

export default [
  familiesModel as ITableInfo,
  imagesModel as ITableInfo,
  productsModel as ITableInfo,
  rolesModel as ITableInfo,
  usersModel as ITableInfo,
  usersrolesModel as ITableInfo,
]
