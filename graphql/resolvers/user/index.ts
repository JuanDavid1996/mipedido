const User = require("@models/User").Users
import { IResolvers } from "graphql-tools";

export interface UserInput {
    user: {
        code: string,
        firstName: string,
        lastName: string,
        username: string,
        password: string,
        role: string,
        phone: string
    }
}

const userResolvers: IResolvers = {
    users: () => {
        return User.find();
    },
    user: (parent, args) => {
        return User.findById(args.id);
    },

    addUser: async  ({user}: UserInput) =>  {
        const exist = await User.findOne({username: user.username})
        if (exist) throw Error("Nombre de usuario en uso")
        return User.create(user);
    }
}

export default userResolvers;