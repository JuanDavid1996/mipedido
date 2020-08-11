import {getPermissionById, getPermissions, getRoleById} from "../../../DataSource";
import Permission from "../../../models/Permission";
import {verifyCurrentUser} from "../../../helpers/authHelpers";

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

    updatePermission(obj: any, {_id, name}: any, context: any) {
        verifyCurrentUser(context);
        if (!_id) return;
        return Permission.findOneAndUpdate(
            {
                _id
            },{
                $set: { name }
            }, {new: true}, (err: any, role: any) => {
                if (err) {
                    throw new Error("Se produjo un error al actualizar el permiso")
                }
                return role;
            }
        )
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