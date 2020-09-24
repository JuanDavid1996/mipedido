import {IOrder} from "../models/Order";


require('dotenv').config({
    path: __dirname+"/../.env"
})

import connectDB from "../config/db";
import {getOrderByIdCache} from "../DataSource/cache";

function main() {
  connectDB().then(async () => {
    console.log("main!");
    const order: IOrder = await getOrderByIdCache("5f633b9ad296570ae0d25ee3");
    console.log(order)
  })
}

main();