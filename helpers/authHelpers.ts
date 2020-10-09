import {getStoreById} from "../DataSource";
import {IUser} from "../models/User";
import {getRoleByIdCache, getUserWithPermissionsCache} from "../DataSource/cache";
import {IRole} from "../models/Role";
import {BASE_ROLES} from "../constants";

export const noAuthorized = () => {
	throw Error("No autorizado");
}

export function verifyCurrentUser(context: any) {
    if (!context.currentUser) throw new Error("Please login");
}

export async function verifyIfStoreBelongsToUser(user: any, storeId: string) {
    if (!storeId) {
        throw Error("storeId invalido");
    }

    const store: any = await getStoreById(storeId);
    const belongs = store.owner.toString() === user._id.toString();
    if (!belongs) {
        noAuthorized();
    }
}

const getPermissions = async (currentUser: any) => {
    const user: IUser = await getUserWithPermissionsCache(currentUser._id)
    return await user.role.permissions.map((p: any) => p.resource);
}

export async function checkPermission(name: string, context: any) {
    const { currentUser } = context;
    const permissions = await getPermissions(currentUser);
	const hasPermission = permissions.includes(name);
	if (!hasPermission) noAuthorized();
}

export async function checkPermissions(names: string[], context: any) {
    const { currentUser } = context;
    const permissions = await getPermissions(currentUser);
    for (let index = 0; index < names.length; index++) {
        const name = names[index];
        const hasPermission = permissions.includes(name);
        if (!hasPermission) noAuthorized()
    }
}

export async function isAdmin(context: any) {
    const role: IRole = await getRoleByIdCache(context.currentUser.role);
    return role.name === BASE_ROLES.ADMIN;
}