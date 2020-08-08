import User from "../../../models/User";
import jwt from "jsonwebtoken";
import {getUserById} from "../../../DataSource";

const KEY = "¡¡KEY!!";

export default {
    mutations: {
        async login(obj: any, { username, password } : { username: string, password: string }) {
            const user: any = await User.findOne({username});

            if (!user || !await user.validatePassword(password)) {
                throw Error("Usuario o contraseña errada");
            }

            return jwt.sign({user: user._id}, KEY, {expiresIn: "7d"});
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
