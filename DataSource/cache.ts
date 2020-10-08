import {Document} from "mongoose";
import {
    getUserById,
    getUserWithPermissions,
    getCategories,
    getPermissions,
    getRoles,
    getStores,
    getOrders,
    getUsers,
    getUserDevices,
    getOrdersAvailable,
    getOrdersByStore,
    getOrdersByClient,
    getOrdersByDomiciliary, getOrderById, getRoleById
} from "./index";
import { IUser } from "../models/User";
import { ICategory } from "../models/Category";
import { IPermission } from "../models/Permission";
import { IRole } from "../models/Role";
import { IStore } from "../models/Store";
import { IOrder } from "../models/Order";
import { IUserDevice } from "../models/UserDevice";
import { BASE_ROLES } from "../constants";
import ts from "typescript/lib/tsserverlibrary";
import LogLevel = ts.server.LogLevel;

const redis = require("redis")
const redisClient = redis.createClient()

redisClient.on("error", (error: any) => console.log("REDIS ", error))

function canParse(input: any) {
    try {
        JSON.parse(input);
        return true;
    } catch (e) { return false; }
}

function resolveValue<T>(
    key: string,
    getValue: () => Promise<T>,
    message?: string,
): Promise<T> {
    return new Promise(async (resolve: any) => {
        console.time(message)
        redisClient.get(key, async (err: any, data?: string) => {
            if ((err || !data) || (data && !canParse(data))) {
                const value: T = await getValue();
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

function resolveValues<T extends Document>(
    hashKey: string,
    getValues: () => Promise<T[]>,
    message?: string,
): Promise<T[]> {

    async function getDataFromDb() {
        const values: T[] = await getValues();
        values.forEach((val: T) => {
            redisClient.hset(hashKey, val._id.toString(), JSON.stringify(val));
        });
        return values;
    }

    return new Promise(async (resolve: any) => {
        console.log("BEGIN TRANSACTION ", message);
        console.time(message)
        redisClient.hvals(hashKey, async (err: any, data?: string[]) => {
            if ((err || !data) || !data.length) {
                const values: T[] = await getDataFromDb();
                console.log("=== FROM DB ===")
                console.timeEnd(message)
                resolve(values)
            } else {
                console.log("=== FROM CACHE ===")
                console.log("DATA OF CACHE (BEGIN)")
                console.log(data);
                console.log("DATA OF CACHE (END)")
                try {
                    resolve(data.map((item: string) => JSON.parse(item) as T) as T[])
                } catch (e) {
                    console.log("FAILED TO CONVERT DATA FROM CACHE (message="+message+")");
                    console.log(e);
                    const values: T[] = await getDataFromDb();
                    console.log("GET DATA FROM CACHE (CATCH SECTION)")
                    resolve(values)
                }
                console.timeEnd(message)
            }
        })
    })
}

function getOrUpdateValueCache<T extends Document>(
    key: string,
    getValue: () => Promise<T>,
    message?: string
)  : Promise<T> {
    return resolveValue(key, getValue, message) as Promise<T>
}

function getOrUpdateValuesCache<T extends Document>(
    key: string,
    getValues: () => Promise<T[]>,
    message?: string
)  : Promise<T[]> {
    return resolveValues(key, getValues, message) as Promise<T[]>
}

function findValueAtHash<T extends Document>(
    hashKey: string,
    key: string,
    getValue: () => Promise<T>,
    message?: string
): Promise<T> {
    return new Promise(async (resolve) => {
        redisClient.hget(hashKey, key, async (err: any, data?: string) => {
            console.log("BEGIN TRANSACTION (GET IN HASH)", message);
            console.time(message)
            if ((err || !data) || !data) {
                console.log("GET FROM DB")
                const value: T = await getValue();
                resolve(value);
            } else {
                try {
                    console.log("GET FROM CACHE")
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.log("ERROR WHEN DID USE JSON.PARSE")
                    console.log("GET FROM DB")
                    const value: T = await getValue();
                    addOrUpdateListCache(hashKey, key, value);
                    resolve(value)
                }
            }
            console.timeEnd(message)
        });
    });
}

const clearCache = (key: string) => redisClient.del(key)

const addOrUpdateListCache = (hashKey: string, key: string, value: any) => {
    redisClient.hset(hashKey, key, value)
}

const removeToListCache = (hashKey: string, key: string) => {
    redisClient.hdel(hashKey, key)
}

enum CACHE_KEYS {
    ORDERS = "orders",
    STORES = "stores",
    AVAILABLE_ORDERS = "available_orders",
    USER_DEVICES = "user_devices",
    ROLES = "roles",
    CATEGORIES = "categories",
    PERMISSIONS = "permissions",
    USERS = "users",
    USER = "user"
}

const D_CACHE_KEYS = {
    GET_ORDERS_BY_DOMICILIARY: (key: string) => `${BASE_ROLES.DOMICILIARIO}_${key}_${CACHE_KEYS.ORDERS}`,
    GET_ORDERS_BY_STORE: (key: string) => `${BASE_ROLES.TENDERO}_${key}_${CACHE_KEYS.ORDERS}`,
    GET_ORDERS_BY_CLIENT: (key: string) => `${BASE_ROLES.CLIENTE}_${key}_${CACHE_KEYS.ORDERS}`,
    GET_USER_WITH_PERMISSIONS: (key: any) => `${CACHE_KEYS.USER}_${key}_${CACHE_KEYS.PERMISSIONS}`,
    GET_USER_KEY: (key: any) => `${CACHE_KEYS.USER}_${key}`
}

enum CACHE_LOGS {
    GET_ORDERS = "GET_ORDERS",
    GET_ORDERS_BY_STORE = "GET_ORDERS_BY_STORE",
    GET_STORES = "GET_STORES",
    GET_USER = "GET_USER",
    GET_AVAILABLE_ORDERS = "GET_AVAILABLE_ORDERS",
    GET_USER_WITH_PERMISSION = "GET_USER_WITH_PERMISSION",
    GET_ROLES = "GET_ROLES",
    GET_PERMISSIONS = "GET_PERMISSIONS",
    GET_CATEGORIES = "GET_CATEGORIES",
    GET_USERS = "GET_USERS",
    GET_ORDERS_BY_CLIENT = "GET_ORDERS_BY_CLIENT",
    GET_USER_DEVICES = "GET_USER_DEVICES",
    GET_ORDER_BY_ID = "GET_ORDER_BY_ID",
    GET_ROLE_BY_ID = "GET_ROLE_BY_ID",
}

//User + Permission
export function getUserWithPermissionsCache(userId: string): Promise<IUser> {
    return getOrUpdateValueCache<IUser>(D_CACHE_KEYS.GET_USER_WITH_PERMISSIONS(userId), async () => {
        return await getUserWithPermissions(userId) as IUser;
    }, CACHE_LOGS.GET_USER_WITH_PERMISSION)
}

export function getUserCache(userId: string): Promise<IUser> {
    return getOrUpdateValueCache<IUser>(D_CACHE_KEYS.GET_USER_KEY(userId), async () => {
        return await getUserById(userId) as IUser;
    }, CACHE_LOGS.GET_USER)
}

export const clearUserCache = (userId: string) => clearCache(userId);

export const clearUserWithPermissionCache = (userId: string) => {
    clearCache(D_CACHE_KEYS.GET_USER_WITH_PERMISSIONS(userId));
}


export function getUsersCache() {
    return getOrUpdateValuesCache<IUser>(CACHE_KEYS.USERS, async () => {
        return await getUsers() as IUser[]
    }, CACHE_LOGS.GET_USERS);
}

export function getUserDevicesCache() {
    return getOrUpdateValuesCache<IUserDevice>(CACHE_KEYS.USER_DEVICES, async () => {
        return await getUserDevices()
            .populate({
                path: "user",
                populate: {
                    path: "role",
                    match: {name: BASE_ROLES.DOMICILIARIO}
                }
            }).exec() as IUserDevice[]
    }, CACHE_LOGS.GET_USER_DEVICES);
}

export async function addToUserDevicesCache(userDevice: IUserDevice) {
    addOrUpdateListCache(CACHE_KEYS.USER_DEVICES, userDevice._id, userDevice);
}

export async function updateUserDevicesCache(userDevice: IUserDevice) {
    addOrUpdateListCache(CACHE_KEYS.USER_DEVICES, userDevice._id, userDevice);
}

export function getCategoriesCache() {
    return getOrUpdateValuesCache<ICategory>(CACHE_KEYS.CATEGORIES, async () => {
        return await getCategories() as ICategory[]
    }, CACHE_LOGS.GET_CATEGORIES)
}


//Permissions
export function getPermissionsCache() {
    return getOrUpdateValuesCache<IPermission>(CACHE_KEYS.PERMISSIONS, async  () => {
        return await getPermissions() as IPermission[]
    }, CACHE_LOGS.GET_PERMISSIONS);
}

export async function addToPermissionsCache(permission: IPermission) {
    addOrUpdateListCache(CACHE_KEYS.PERMISSIONS, permission._id, permission);
}

//Roles
export function getRolesCache() {
    return getOrUpdateValuesCache<IRole>(CACHE_KEYS.ROLES, async  () => {
        return await getRoles() as IRole[]
    }, CACHE_LOGS.GET_ROLES);
}

export function getRoleByIdCache(id: string) {
    return findValueAtHash<IRole>(CACHE_KEYS.ROLES, id, async () => {
        return await getRoleById(id) as IRole;
    }, CACHE_LOGS.GET_ROLE_BY_ID)
}

export async function addToRoleCache(role: IRole) {
    addOrUpdateListCache(CACHE_KEYS.ROLES, role._id, role);
}


//Stores
export function getStoresCache() {
    return getOrUpdateValuesCache<IStore>(CACHE_KEYS.STORES, async () => {
        return await getStores() as IStore[]
    }, CACHE_LOGS.GET_STORES);
}

//Orders
export function getOrdersCache() {
    return getOrUpdateValuesCache<IOrder>(CACHE_KEYS.ORDERS, async () => {
        return await getOrders() as IOrder[]
    }, CACHE_LOGS.GET_ORDERS);
}

export function getAvailableOrdersCache() {
    return getOrUpdateValuesCache<IOrder>(CACHE_KEYS.AVAILABLE_ORDERS, async () => {
        return await getOrdersAvailable() as IOrder[]
    }, CACHE_LOGS.GET_AVAILABLE_ORDERS);
}

export const updateOrderCache = async(order: IOrder) => (
    addOrUpdateListCache(CACHE_KEYS.ORDERS, order._id, order)
);

export async function addAvailableOrdersCache(order: IOrder) {
    addOrUpdateListCache(CACHE_KEYS.AVAILABLE_ORDERS, order._id, order);
}

export async function removeAvailableOrdersCache({ _id }: IOrder) {
    removeToListCache(CACHE_KEYS.AVAILABLE_ORDERS, _id);
}

export async function clearAvailableOrdersCache() {
    clearCache(CACHE_KEYS.AVAILABLE_ORDERS)
}

export async function clearOrdersCache() {
    clearCache(CACHE_KEYS.ORDERS)
}

export function getOrdersByDomiciliaryCache(domiciliary: string) {
    return getOrUpdateValuesCache<IOrder>(D_CACHE_KEYS.GET_ORDERS_BY_DOMICILIARY(domiciliary), async () => {
        return await getOrdersByDomiciliary(domiciliary) as IOrder[]
    }, CACHE_LOGS.GET_ORDERS_BY_STORE);
}

export async function getOrdersByStoreCache(store: string) {
    return getOrUpdateValuesCache<IOrder>(D_CACHE_KEYS.GET_ORDERS_BY_STORE(store), async () => {
        return await getOrdersByStore(store) as IOrder[]
    }, CACHE_LOGS.GET_ORDERS_BY_STORE);
}

export async function getOrdersByClientCache(client: string) {
    return getOrUpdateValuesCache<IOrder>(D_CACHE_KEYS.GET_ORDERS_BY_CLIENT(client), async () => {
        return await getOrdersByClient(client) as IOrder[]
    }, CACHE_LOGS.GET_ORDERS_BY_CLIENT);
}

export async function addOrdersByDomiciliaryCache(domiciliary: string, order: IOrder) {
    addOrUpdateListCache(D_CACHE_KEYS.GET_ORDERS_BY_DOMICILIARY(domiciliary), order._id, order);
}

export async function addOrdersByStoreCache(store: string, order: IOrder) {
    addOrUpdateListCache(D_CACHE_KEYS.GET_ORDERS_BY_STORE(store), order._id, order);
}

export async function removeOrdersCache({ _id }: IOrder) {
    removeToListCache(CACHE_KEYS.ORDERS, _id);
}

export async function getOrderByIdCache(id: string) {
    return findValueAtHash<IOrder>(CACHE_KEYS.ORDERS, id, async () => {
        return await getOrderById(id) as IOrder;
    }, CACHE_LOGS.GET_ORDER_BY_ID);
}

//
export async function clearCacheDb(cb: (err: any) => void) {
    redisClient.flushall('ASYNC', cb);
}