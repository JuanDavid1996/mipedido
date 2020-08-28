import User from "../../../models/User";
import jwt from "jsonwebtoken";
import {getUserById} from "../../../DataSource";

const KEY = "¡¡KEY!!";

export const generateToken = (user: string) => {
    return jwt.sign({user}, KEY, {expiresIn: "7d"});
}

export default {
    mutations: {
        async login(obj: any, { username, password } : { username: string, password: string }) {
            console.log("params ", username, " ", password);
            const user: any = await User.findOne({username});

            if (!user || !await user.validatePassword(password)) {
                throw Error("Usuario o contraseña errada");
            }

            return generateToken(user._id);
        },
    }
}

export async function verify(token: string) {
    return jwt.verify(token, KEY, );
}

export async function getUserByToken(token?: string) {
    if (token) {
        const decoded: any = await verify(token);
        if (decoded.user) {
            return getUserById(decoded.user);
        }
    }
    return undefined;
}
