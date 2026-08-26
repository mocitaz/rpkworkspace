import UserController from './UserController'
import RoleController from './RoleController'

const Admin = {
    UserController: Object.assign(UserController, UserController),
    RoleController: Object.assign(RoleController, RoleController),
}

export default Admin