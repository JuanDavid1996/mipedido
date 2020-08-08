import {getOrderStatusByName} from "../DataSource";
import connectDB from "../config/db";

(function main() {
    connectDB().then(async () => {
        console.log("main!");
        console.log(await getOrderStatusByName("Pendiente"));
        console.log("end");
    })
})();