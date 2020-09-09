import User, {IUser} from "../models/User";
import Permission from "../models/Permission";
import Role from "../models/Role";
import Category from "../models/Category";
import StoreType from "../models/StoreType";
import Order from "../models/Order";
import OrderStatus, {IOrderStatus} from "../models/OrderStatus";
import Store from "../models/Store";
import Client from "../models/Client";
import {DocumentQuery} from "mongoose";
import UserDevice from "../models/UserDevice";
import {BASE_ROLES, ORDER_STATUS} from "../constants";
import SuggestedStore from "../models/SuggestedStore";

export function getUserById(id: string) {
    return User.findById(id, { password: 0 });
}

export function getUserWithPermissions(id: string): Promise<IUser> {
    return User.findById(id).populate({
        path: "role",
        populate: {
            path: "permissions"
        }
    }).exec() as Promise<IUser>;
}

export function getUsers() : DocumentQuery<IUser[], IUser> {
    return User.find();
}

export async function getUsersByRoleName(roleName: string) {
    const role: any = await getRoleByName(roleName);
    return User.find({role: role._id});
}



export function getPermissionById(id: string)  {
    return Permission.findById(id);
}

export function getPermissionByKeys(ids: string[])  {
    return Permission.find({ _id: { $in: ids} });
}

export function getPermissions() {
    return Permission.find().sort({ resource: 'asc'});
}

export function getPermissionByRole(role: string) {
    return Permission.find({role})
}



export function getRoleById(id: string) {
    return Role.findById(id);
}

export function getRoles() {
    return Role.find();
}

export function getRoleByName(name: string) {
    return Role.findOne({name}).exec();
}


export function getCategoryById(id: string) {
    return Category.findById(id);
}

export function getCategories() {
    return Category.find();
}



export function getStoreTypeById(id: string) {
    return StoreType.findById(id)
}

export function getStoreTypes() {
    return StoreType.find();
}



export function getStores() {
    return Store.find();
}

export function getStoreById(id: string) {
    return Store.findById(id);
}

export function getStoreByOwner(owner: any) {
    return Store.findOne({ owner: owner._id });
}

export function getStoresByOwner(owner: string) {
    return Store.find({ owner: owner });
}



export function getOrderById(id: string) {
    return Order.findById(id);
}

export function getOrders() {
    return Order.find({});
}

export function getOrdersByStore(store: string) {
    return Order.find({ store });
}

export function getOrdersByDomiciliary(domiciliary: string) {
    return Order.find({ domiciliary });
}

export async function getOrdersAvailable() {
    const status: IOrderStatus = await getOrderStatusByName(ORDER_STATUS.PENDIENTE);
    const conditions: any = { status: status._id }
    return Order.find(conditions);
}

export async function getOrderByDomiciliaryWithStatus(domiciliary: string, statusName: ORDER_STATUS) {
    const status = await getOrderStatusByName(statusName);
    return Order.findOne({ status: status._id, domiciliary });
}


export function getOrderStatusById(id: string) {
    return OrderStatus.findById(id);
}

export function getOrderStatuses() {
    return OrderStatus.find();
}

export async function getOrderStatusByName(name: string): Promise<IOrderStatus> {
    return await OrderStatus.findOne({name: name}) as IOrderStatus;
}


export function getSuggestedStores() {
    return SuggestedStore.find();
}


export function getStoreClients(storeId?: string, code?: string, firstName?: string, phone?: string) {
    let condition: any = {};
    if (storeId) condition.store = storeId;
    if (code && code.trim() !== "") condition.code = { $regex: '.*'+ code + '.*', '$options' : 'i' }
    if (firstName && firstName.trim() !== "") condition.firstName = { $regex: '.*'+ firstName + '.*', '$options' : 'i' }
    if (phone && phone.trim() !== "") condition.phone = { $regex: '.*'+ phone + '.*', '$options' : 'i' }


    return Client.find(condition);
}

export function getStoreClientById(id: string) {
    return Client.findById(id);
}

export function getUserDevices() {
    return UserDevice.find()
}

export function getUserDeviceByIds(ids: String[]) {
    return UserDevice.find({ user: { $in: ids } })
}

export function getUserDevice(user: string) {
    return UserDevice.findOne({ user })
}

export default {
    getUserById,
    getUsers,
    getUsersByRoleName,
    getPermissionById,
    getPermissions,
    getPermissionByRole,
    getRoleById,
    getRoleByName,
    getRoles,
    getCategoryById,
    getCategories,
    getStoreTypeById,
    getOrderById,
    getOrders,
    getStores,
    getStoreClients,
    getOrderStatusByName,
    getUserDevices,
    getUserDevice,
}