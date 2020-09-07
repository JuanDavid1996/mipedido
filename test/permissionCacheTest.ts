import UserDevice from "../models/UserDevice";

require('dotenv').config({
    path: "../.env"
})

import connectDB from "../config/db";
import {BASE_ROLES} from "../constants";
import {getUserDevices} from "../DataSource";
import userDevice from "../graphql/resolvers/userDevice";
import User, {IUser} from "../models/User";
import {getUserWithPermissionsCache} from "../DataSource/cache";

function main() {
    connectDB().then(async () => {
        console.log("main!");
        const user: IUser = await User.findOne() as IUser
        await getUserWithPermissionsCache(user._id)
        // console.log(userWithPermissions)
    })
}

main();