import User from "../../../models/User";
import {getRoleById, getUserById, getUsers, getUsersByRoleName} from "../../../DataSource";

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
    shopkeepers: async() => getUsersByRoleName("Tendero"),
    clients: async() => getUsersByRoleName("Cliente"),
    currentUser: (obj: any, args: any, context: any) => context.currentUser,
}

const resolvers = {
    role: (args: any) => getRoleById(args.role),
}

const mutations = {

    addUser: async  (context: any, {user}: any) =>  {
        const exist = await User.findOne({username: user.username})
        if (exist) throw Error("Nombre de usuario en uso")
        return User.create(user);
    },
    updateUser: async (context: any, {user}: UserInput<BaseUserUpdateInput>) =>{
        const params: any = { ...user }
        delete params._id;
        delete params.password;
        await User.updateOne({ _id: user._id }, { ...params });
        return User.findById(user._id);
    }
}

export default {
    queries,
    resolvers,
    mutations
}