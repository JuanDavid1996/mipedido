require('dotenv').config({
    path: __dirname+"/../.env"
})

import {getOrdersCache, updateOrderCache} from "../DataSource/cache";
import connectDB from "../config/db";

function main() {
    connectDB().then(async () => {
        console.log("main!");
        const orders = await getOrdersCache()
        console.log(orders)
        console.log("before to update a element")
        const order = orders[0]
        order.description = "THIS MESSAGE IS A TEST"
        await updateOrderCache(order)
        console.log("print all orders")
        console.log(await getOrdersCache())
    })
}

main();