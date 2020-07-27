const User = require("@models/User").Users
import { IResolvers } from "graphql-tools";

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


const userResolvers: IResolvers = {
    
    users: () => {
        return User.find().populate("role").exec();
    },
    user: (args) => {
        return User.findById(args._id).populate("role").exec();
    },


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
        return await User.findById(user._id);
    }
}

export default userResolvers;