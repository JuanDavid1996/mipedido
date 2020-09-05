import {getPermissionById, getPermissions} from "../../../DataSource";
import Permission from "../../../models/Permission";
import {checkPermission, verifyCurrentUser} from "../../../helpers/authHelpers";
import {PERMISSIONS} from "../../../constants";

const queries = {
    permissions: () => getPermissions(),
    permission: (obj: any,  args: any) => getPermissionById(args._id),
}

const resolvers = {
    // role: (args: any) => getRoleById(args.role),
}

const mutations = {

    async addPermission(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        const {resource} = args;
        return Permission.create({resource});
    },

    async updatePermission(obj: any, {_id, name}: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.UPDATE_PERMISSIONS, context.currentUser)
        if (!_id) throw Error("Request no valido")
        return Permission.findOneAndUpdate({_id}, {$set: {name}});
    },

    deletePermission(obj: any, {_id}: any, context: any) {
        verifyCurrentUser(context);
        return Permission.findOneAndDelete({_id})
    }

}
export default {
    queries,
    resolvers,
    mutations,
};