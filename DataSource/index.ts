import User from "../models/User";
import Permission from "../models/Permission";
import Role from "../models/Role";
import Category from "../models/Category";
import StoreType from "../models/StoreType";
import {DocumentQuery} from "mongoose";

export function getUserById(id: string) {
    return User.findById(id);
}

export function getPermissionById(id: string) {
    return Permission.findById(id);
}

export function getRoleById(id: string) {
    return Role.findById(id);
}

export function getCategoryById(id: string) {
    return Category.findById(id);
}

export function getStoreTypeById(id: string) {
    return StoreType.findById(id)
}

export default {
    getUserById,
    getPermissionById,
    getRoleById,
    getCategoryById,
    getStoreTypeById
}