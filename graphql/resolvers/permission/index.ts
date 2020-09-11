import {getPermissionById} from "../../../DataSource";
import Permission from "../../../models/Permission";
import {checkPermission, verifyCurrentUser} from "../../../helpers/authHelpers";
import {PERMISSIONS} from "../../../constants";
import { getPermissionsCache } from "../../../DataSource/cache";

const queries = {
    permissions: async (obj: any, args: any, context: any) => {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.LIST_PERMISSION, context);
        return getPermissionsCache()
    },
    permission: async (obj: any,  args: any, context: any) => {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.SHOW_PERMISSION, context);
        return getPermissionById(args._id)
    },
}

const resolvers = {}

const mutations = {

    async addPermission(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.ADD_PERMISSION, context);

        const {resource} = args;
        return Permission.create({resource});
    },

    async updatePermission(obj: any, {_id, name}: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.UPDATE_PERMISSIONS, context)
        if (!_id) throw Error("Request no valido")
        return Permission.findOneAndUpdate({_id}, {$set: {name}});
    },

    async deletePermission(obj: any, {_id}: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.DELETE_PERMISSION, context)
        return Permission.findOneAndDelete({_id})
    }

}
export default {
    queries,
    resolvers,
    mutations,
};