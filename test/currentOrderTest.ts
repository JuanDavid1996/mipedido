import {IOrder} from "../models/Order";


require('dotenv').config({
    path: __dirname+"/../.env"
})

import connectDB from "../config/db";
import {getOrderByIdCache} from "../DataSource/cache";
import {getOrderByDomiciliaryWithStatus, getRoleByName} from "../DataSource";
import {BASE_ROLES, ORDER_STATUS} from "../constants";
import User, {IUser} from "../models/User";

function main() {
    connectDB().then(async () => {
        console.log("CONNECTED")
        const role = await getRoleByName(BASE_ROLES.DOMICILIARIO);
        console.log("ROLE = ", role);

        const domi = await User.find({ role }).findOne() as IUser;
        console.log("DOMI = ", domi);

        const orderTaken = await getOrderByDomiciliaryWithStatus(domi._id, ORDER_STATUS.TOMADO)
        const orderInProgress = await getOrderByDomiciliaryWithStatus(domi._id, ORDER_STATUS.EN_CURSO)

        console.log("ORDER TAKEN")
        console.log(orderTaken)
        console.log("ORDER IN PROGRESS")
        console.log(orderInProgress)
    })
}

main();