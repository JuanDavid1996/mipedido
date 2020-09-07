import {getOrderStatusByName, getRoles} from "../DataSource";
import connectDB from "../config/db";
import {IRole} from "../models/Role";

(function main() {
    connectDB().then(async () => {
        console.log("main!");
        console.log(await getOrderStatusByName("Pendiente"));
        const roles: IRole[] = await getRoles();
        roles.forEach((role: any) => {
            console.log("role: ", role)
        });
        console.log("end");
        if (roles[0].permissions.length > 0) {
            // const permission: IPermission = new Permission({ resource: "addPermission" });
            // await permission.save();
            const role: IRole = roles[0];
            console.log("hasPermission", role.permissions.indexOf("5f2f36fc0c6917d81155e657") > -1);
              // .push(permission);
            // await roles[0].save()
        }
    })
})();