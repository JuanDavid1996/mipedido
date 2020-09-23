require('dotenv').config({
    path: __dirname+"/../.env"
})

import {getOrdersCache} from "../DataSource/cache";
import connectDB from "../config/db";

function main() {
    connectDB().then(async () => {
        console.log("main!");
        const orders = await getOrdersCache()
        console.log(orders)
    })
}

main();