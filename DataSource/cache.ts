import {Document} from "mongoose";
import {getUserWithPermissions} from "./index";
import {IUser} from "../models/User";

const redis = require("redis")
const redisClient = redis.createClient()

redisClient.on("error", (error: any) => {
    console.log("REDIS ", error);
})

const getUserKey = (user: any) => `${user}_permissions`

function getOrUpdateCache<T extends Document>(
    key: string,
    getValue: () => Promise<T>
)  : Promise<T> {
    return new Promise(async (resolve: any, rejected: any) => {
        console.time("GET_USER_WITH_PERMISSION")
        redisClient.get(key, async (err: any, data?: string) => {
            if (err || !data) {
                const value = await getValue();
                redisClient.set(key, JSON.stringify(value), redis.print)
                console.log("=== FROM DB ===")
                console.timeEnd("GET_USER_WITH_PERMISSION")
                resolve(value)
            } else {
                console.log("=== FROM CACHE ===")
                console.timeEnd("GET_USER_WITH_PERMISSION")
                resolve(JSON.parse(data) as T)
            }
        })
    })
}

export function getUserWithPermissionsCache(userId: any): Promise<IUser> {
    const key = getUserKey(userId);
    return getOrUpdateCache<IUser>(key, async () => {
        return await getUserWithPermissions(userId) as IUser;
    })
    // return new Promise(async (resolve: any, rejected: any) => {
    //     redisClient.get(key, async (err: any, data?: string) => {
    //         if (err || !data) {
    //             const userWithPermission = await getUserWithPermissions(userId);
    //             redisClient.set(key, userWithPermission, redis.print)
    //             resolve(userWithPermission)
    //         } else {
    //             resolve(JSON.parse(data) as IUser)
    //         }
    //     })
    // })
}