import Role from "../../../models/Role";
import {getPermissionById, getPermissionByKeys, getRoleById, getRoles} from "../../../DataSource";
import {verifyCurrentUser, checkPermission} from "../../../helpers/authHelpers";
import { PERMISSIONS } from "../../../constants";

const queries = {
    roles: async (obj: any, args: any, context: any) => {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.LIST_ROLE, context);
        return getRoles()
    },
    role: async (context: any, args: any) => {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.SHOW_ROLE, context);
        return getRoleById(args._id)
    },
}

const resolvers = {
    permissions: async (args: any, context: any) => {
        return getPermissionByKeys(args.permissions)
    },
}

const mutations = {

    async addRole(obj: any, {name}: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.ADD_ROLE, context);
        return Role.create({name, permissions: []});
    },
    async updateRole(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.UPDATE_ROLE, context);
        if (!args._id) return;
        return Role.findOneAndUpdate({_id: args._id }, { $set: { name: args.name } });
    },
    async deleteRole(obj: any, {_id}: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.DELETE_ROLE, context);
        return Role.findOneAndDelete({_id: _id})
    },
    async addPermissionToRole(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.ADD_PERMISSION_TO_ROLE, context);
        const role: any = await getRoleById(args._id);
        if ( role.permissions.indexOf(args.permission) === -1) {
            role.permissions.push(await getPermissionById(args.permission))
            await role.save();
        }
        return role;
    },
    async removePermissionToRole(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.REMOVE_PERMISSION_TO_ROLE, context);
        const role: any = await getRoleById(args._id);
        let index =  role.permissions.indexOf(args.permission);
        if ( index > -1) {
            (role.permissions as Array<any>).splice(index, 1);
            await role.save();
        }
        return role;
    },
}
export default {
    queries,
    resolvers,
    mutations,
};