import User from "../../../models/User";
import {getRoleById, getUserById, getUsers, getUsersByRoleName} from "../../../DataSource";
import {checkPermission, verifyCurrentUser} from "../../../helpers/authHelpers";
import {BASE_ROLES} from "../../../constants";

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
    users: () => getUsers(),
    user: (context: any, args: any) => getUserById(args._id),
    shopkeepers: async() => getUsersByRoleName(BASE_ROLES.TENDERO),
    clients: async() => getUsersByRoleName(BASE_ROLES.CLIENTE),
    currentUser: (obj: any, args: any, context: any) => context.currentUser,
}

const resolvers = {
    role: (args: any) => getRoleById(args.role),
}

const mutations = {

    addUser: async  (obj: any, {user}: any, context: any) =>  {
        verifyCurrentUser(context);
        const exist = await User.findOne({username: user.username})
        if (exist) throw Error("Nombre de usuario en uso")
        return User.create(user);
    },
    updateUser: async (obj: any, {user}: UserInput<BaseUserUpdateInput>, context: any) =>{
        verifyCurrentUser(context);
        const params: any = { ...user }
        delete params._id;
        delete params.password;
        await User.updateOne({ _id: user._id }, { ...params });
        return User.findById(user._id);
    },
    async deleteUser(obj: any, args: any, context: any) {
        verifyCurrentUser(context)
        await checkPermission("deleteUser", context.currentUser);
        return User.findByIdAndDelete(args._id)
    }
}

export default {
    queries,
    resolvers,
    mutations
}