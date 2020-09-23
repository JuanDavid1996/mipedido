require('dotenv').config({
    path: __dirname+"/../.env"
})

import connectDB from "../config/db";
import User, {IUser} from "../models/User";
import {getUserWithPermissionsCache} from "../DataSource/cache";

function main() {
    connectDB().then(async () => {
        console.log("main!");
        const user: IUser = await User.findOne() as IUser
        await getUserWithPermissionsCache(user._id)
    })
}

main();