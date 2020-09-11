import User from "../../../models/User";
import {getRoleById, getUserById, getUsers, getUsersByRoleName} from "../../../DataSource";
import {checkPermission, checkPermissions, verifyCurrentUser} from "../../../helpers/authHelpers";
import {BASE_ROLES, PERMISSIONS} from "../../../constants";
import { getUsersCache } from "../../../DataSource/cache";

interface BaseUserInput {
    code: string,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    role: string,
    phone: string
}

interface BaseUserUpdateInput extends BaseUserInput {
    _id: string;
}

interface UserInput<T> {
    user: T;
}

const queries = {
    async users(obj: any, args: any, context: any) {
        verifyCurrentUser(context)
        await checkPermissions([PERMISSIONS.LIST_USER], context)
        return getUsersCache();
    },
    async user(obj: any, args: any, context: any) {
        verifyCurrentUser(context)
        await checkPermissions([PERMISSIONS.SHOW_USER], context)
        return getUserById(args._id)
    },
    shopkeepers: async(obj: any, args: any, context: any) => {
        verifyCurrentUser(context)
        await checkPermissions([PERMISSIONS.LIST_SHOP_KEEPER], context)
        return getUsersByRoleName(BASE_ROLES.TENDERO)
    },
    clients: async(obj: any, args: any, context: any) => {
        verifyCurrentUser(context)
        await checkPermissions([PERMISSIONS.LIST_CUSTOMER], context)
        return getUsersByRoleName(BASE_ROLES.CLIENTE)
    },
    currentUser: (obj: any, args: any, context: any) => {
        verifyCurrentUser(context)
        return context.currentUser
    },
}

const resolvers = {
    role: (args: any) => getRoleById(args.role),
}

const mutations = {

    addUser: async (obj: any, {user}: any, context: any) =>  {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.ADD_USER, context);
        const exist = await User.findOne({username: user.username})
        if (exist) throw Error("Nombre de usuario en uso")
        return User.create(user);
    },
    updateUser: async (obj: any, {user}: UserInput<BaseUserUpdateInput>, context: any) =>{
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.UPDATE_USER, context);
        const params: any = { ...user }
        // if (params.role) params.role = new Schema.Types.ObjectId(params.role)
        delete params._id;
        delete params.password;
        await User.updateOne({ _id: user._id }, { ...params });
        return User.findById(user._id);
    },
    async deleteUser(obj: any, args: any, context: any) {
        verifyCurrentUser(context)
        await checkPermission(PERMISSIONS.DELETE_USER, context);
        return User.findByIdAndDelete(args._id)
    }
}

export default {
    queries,
    resolvers,
    mutations
}