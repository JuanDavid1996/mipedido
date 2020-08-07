import User from "../../../models/User";
import Role from "../../../models/Role";

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
    users: () => {
        return User.find();
    },
    user: (args: any) => {
        return User.findById(args._id).populate("role").exec();
    },
    shopkeepers: async() => {
        const role: any = await Role.findOne({name: "Tendero"}).exec();
        return User.find({role: role._id});
    },
    clients: async() => {
        const role: any = await Role.findOne({name: "Cliente"}).exec();
        return User.find({role: role._id});
    },
}

const resolvers = {

    role: (args: any) => {
        return Role.findById(args.role);
    }

}

const mutations = {

    addUser: async  ({user}: UserInput<BaseUserInput>) =>  {
        const exist = await User.findOne({username: user.username})
        if (exist) throw Error("Nombre de usuario en uso")
        return User.create(user);
    },
    updateUser: async ({user}: UserInput<BaseUserUpdateInput>) =>{
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