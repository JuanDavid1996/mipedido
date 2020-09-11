import {Document} from "mongoose";
import {
    getUserById,
    getUserWithPermissions,
    getCategories,
    getPermissions,
    getRoles,
    getStores,
    getOrders,
    getUsers
} from "./index";
import { IUser } from "../models/User";
import { ICategory } from "../models/Category";
import { IPermission } from "../models/Permission";
import { IRole } from "../models/Role";
import { IStore } from "../models/Store";
import { IOrder } from "../models/Order";

const redis = require("redis")
const redisClient = redis.createClient()

redisClient.on("error", (error: any) => console.log("REDIS ", error))

const getUserWithPermissionKey = (user: any) => `${user}_permissions`

function reolveValue(
    key: string,
    getValue: () => Promise<any>,
    message?: string,
) {
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
                resolve(JSON.parse(data))
            }
        })
    })
}

function getOrUpdateValueCache<T extends Document>(
    key: string,
    getValue: () => Promise<T>,
    message?: string
)  : Promise<T> {
    return reolveValue(key, getValue, message) as Promise<T>
}

function getOrUpdateValuesCache<T extends Document>(
    key: string,
    getValue: () => Promise<Array<T>>,
    message?: string
)  : Promise<Array<T>> {
    return reolveValue(key, getValue, message) as Promise<Array<T>>
}

const clearCache = (key:string) => redisClient.del(key)

export function getUserWithPermissionsCache(userId: string): Promise<IUser> {
    const key = getUserWithPermissionKey(userId);
    return getOrUpdateValueCache<IUser>(key, async () => {
        return await getUserWithPermissions(userId) as IUser;
    }, "GET_USER_WITH_PERMISSION")
}

export function getUserCache(userId: string): Promise<IUser> {
    return getOrUpdateValueCache<IUser>(userId, async () => {
        return await getUserById(userId) as IUser;
    }, "GET_USER")
}

export const clearUserCache = (userId: string) => clearCache(userId);

export const clearUserWithPermissionCache = (userId: string) => clearCache(getUserWithPermissionKey(userId));

export function getCategoriesCache() {
    const key = "categories";
    return getOrUpdateValuesCache<ICategory>(key, async () => {
        return await getCategories() as ICategory[]
    }, "GET_CATTEGORIES")
}

export function getPermissionsCache() {
    const key = "permissions";
    return getOrUpdateValuesCache<IPermission>(key, async  () => {
        return await getPermissions() as IPermission[]
    }, "GET_PERMISSIONS");
}

export function getRolesCache() {
    const key = "roles";
    return getOrUpdateValuesCache<IRole>(key, async  () => {
        return await getRoles() as IRole[]
    }, "GET_ROLES");
}

export function getStoresCache() {
    const key = "stores";
    return getOrUpdateValuesCache<IStore>(key, async () => {
        return await getStores() as IStore[]
    }, "GET_STORES");
}

export function getOrdersCache() {
    const key = "orders";
    return getOrUpdateValuesCache<IOrder>(key, async () => {
        return await getOrders() as IOrder[]
    }, "GET_ORDERS");
}

export function getUsersCache() {
    const key = "users";
    return getOrUpdateValuesCache<IUser>(key, async () => {
        return await getUsers() as IUser[]
    }, "GET_USERS");
}