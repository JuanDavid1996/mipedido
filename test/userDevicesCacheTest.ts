

require('dotenv').config({
    path: __dirname+"/../.env"
})

import connectDB from "../config/db";
import {BASE_ROLES} from "../constants";
import {getUserDevicesCache} from "../DataSource/cache";

function main() {
  connectDB().then(async () => {
    console.log("main!");
    const uDevices: any = await getUserDevicesCache()
    console.log(uDevices)
  })
}

main();