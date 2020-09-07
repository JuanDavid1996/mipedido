import {Document} from "mongoose";
import {getUserById, getUserWithPermissions} from "./index";
import {IUser} from "../models/User";

const redis = require("redis")
const redisClient = redis.createClient()

redisClient.on("error", (error: any) => {
    console.log("REDIS ", error);
})

const getUserKey = (user: any) => `${user}_permissions`

function getOrUpdateCache<T extends Document>(
    key: string,
    getValue: () => Promise<T>,
    message?: string
)  : Promise<T> {
    return new Promise(async (resolve: any) => {
        console.time(message)
        redisClient.get(key, async (err: any, data?: string) => {
            if (err || !data) {
                const value = await getValue();
                redisClient.set(key, JSON.stringify(value), redis.print)
                console.log("=== FROM DB ===")
                console.timeEnd(message)
                resolve(value)
            } else {
                console.log("=== FROM CACHE ===")
                console.timeEnd(message)
                resolve(JSON.parse(data) as T)
            }
        })
    })
}

export function getUserWithPermissionsCache(userId: any): Promise<IUser> {
    const key = getUserKey(userId);
    return getOrUpdateCache<IUser>(key, async () => {
        return await getUserWithPermissions(userId) as IUser;
    }, "GET_USER_WITH_PERMISSION")
}

export function getUserCache(userId: any): Promise<IUser> {
    return getOrUpdateCache<IUser>(userId, async () => {
        return await getUserById(userId) as IUser;
    }, "GET_USER")
}