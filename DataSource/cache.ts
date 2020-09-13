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
    getOrdersByDomiciliary
} from "./index";
import { IUser } from "../models/User";
import { ICategory } from "../models/Category";
import { IPermission } from "../models/Permission";
import { IRole } from "../models/Role";
import { IStore } from "../models/Store";
import { IOrder } from "../models/Order";
import { IUserDevice } from "../models/UserDevice";
import { BASE_ROLES } from "../constants";

const redis = require("redis")
const redisClient = redis.createClient()

redisClient.on("error", (error: any) => console.log("REDIS ", error))

function canParse(input: any) {
    try {
        JSON.parse(input);
        return true;
    } catch (e) { return false; }
}

function reolveValue(
    key: string,
    getValue: () => Promise<any>,
    message?: string,
) {
    return new Promise(async (resolve: any) => {
        console.time(message)
        redisClient.get(key, async (err: any, data?: string) => {
            if ((err || !data) || (data && !canParse(data))) {
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

const clearCache = (key: string) => redisClient.del(key)

const updateCache = (key: string, value: any) => redisClient.set(key, JSON.stringify(value), redis.print);

enum CACHE_KEYS {
    ORDERS = "orders",
    STORES = "stores",
    AVAILABLE_ORDERS = "available_orders",
    USER_DEVICES = "user_devices",
    ROLES = "roles",
    CATEGORIES = "categories",
    PERMISSIONS = "permissions",
    USERS = "users",
}

const D_CACHE_KEYS = {
    GET_ORDERS_BY_DOMICILIARY: (key: string) => `${key}_${BASE_ROLES.DOMICILIARIO}_${CACHE_KEYS.ORDERS}`,
    GET_ORDERS_BY_STORE: (key: string) => `${key}_${BASE_ROLES.TENDERO}_${CACHE_KEYS.ORDERS}`,
    GET_ORDERS_BY_CLIENT: (key: string) => `${key}_${BASE_ROLES.CLIENTE}_${CACHE_KEYS.ORDERS}`,
    GET_USER_WITH_PERMISSIONS: (key: any) => `${key}_${CACHE_KEYS.PERMISSIONS}`
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
    GET_CATTEGORIES = "GET_CATTEGORIES",
    GET_USERS = "GET_USERS",
    GET_ORDERS_BY_CLIENT = "GET_ORDERS_BY_CLIENT",
    GET_USER_DEVICES = "GET_USER_DEVICES"
}

//User + Permission
export function getUserWithPermissionsCache(userId: string): Promise<IUser> {
    return getOrUpdateValueCache<IUser>(D_CACHE_KEYS.GET_USER_WITH_PERMISSIONS(userId), async () => {
        return await getUserWithPermissions(userId) as IUser;
    }, CACHE_LOGS.GET_USER_WITH_PERMISSION)
}

export function getUserCache(userId: string): Promise<IUser> {
    return getOrUpdateValueCache<IUser>(userId, async () => {
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

export function getCategoriesCache() {
    return getOrUpdateValuesCache<ICategory>(CACHE_KEYS.CATEGORIES, async () => {
        return await getCategories() as ICategory[]
    }, CACHE_LOGS.GET_CATTEGORIES)
}


export function getPermissionsCache() {
    return getOrUpdateValuesCache<IPermission>(CACHE_KEYS.PERMISSIONS, async  () => {
        return await getPermissions() as IPermission[]
    }, CACHE_LOGS.GET_PERMISSIONS);
}


export function getRolesCache() {
    return getOrUpdateValuesCache<IRole>(CACHE_KEYS.ROLES, async  () => {
        return await getRoles() as IRole[]
    }, CACHE_LOGS.GET_ROLES);
}


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

export async function addOrdersCache(order: IOrder) {
    const orders: IOrder[] = await getOrdersCache()
    orders.push(order);
    updateCache(CACHE_KEYS.ORDERS, orders);
}

export async function addAvailableOrdersCache(order: IOrder) {
    const orders: IOrder[] = await getOrdersCache()
    orders.push(order);
    updateCache(CACHE_KEYS.AVAILABLE_ORDERS, orders);
}

export async function removeAvailableOrdersCache({ _id }: IOrder) {
    const orders: IOrder[] = await getOrdersCache()
    updateCache(
        CACHE_KEYS.AVAILABLE_ORDERS,
        orders.filter(order => order._id !== _id)
    );
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
    const orders = await getOrdersByDomiciliaryCache(domiciliary);
    orders.push(order);
    updateCache(D_CACHE_KEYS.GET_ORDERS_BY_DOMICILIARY(domiciliary), orders);
}

export async function addOrdersByStoreCache(store: string, order: IOrder) {
    const orders = await getOrdersByDomiciliaryCache(store);
    orders.push(order);
    updateCache(D_CACHE_KEYS.GET_ORDERS_BY_STORE(store), orders);
}

export async function removeOrdersCache({ _id }: IOrder) {
    const orders = await getOrdersCache();
    updateCache(
        CACHE_KEYS.ORDERS,
        orders.filter(order => order._id !== _id)
    );
}