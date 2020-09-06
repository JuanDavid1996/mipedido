import UserDevice from "../models/UserDevice";

require('dotenv').config({
  path: "../.env"
})

import connectDB from "../config/db";
import {BASE_ROLES} from "../constants";
import {getUserDevices} from "../DataSource";
import userDevice from "../graphql/resolvers/userDevice";

function main() {
  connectDB().then(async () => {
    console.log("main!");
    const uDevices: any = await getUserDevices()
      .populate({
        path: "user",
        populate: {
          path: "role",
          match: { name: BASE_ROLES.DOMICILIARIO }
        }
      }).exec()

    const registrationIds = uDevices.filter((uDevice: any) => uDevice.user.role).map((ud: any) => ud.firebaseToken);
    console.log(registrationIds)
  })
}

main();