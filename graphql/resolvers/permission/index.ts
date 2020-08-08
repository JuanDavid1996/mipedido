import {getPermissionById, getPermissions, getRoleById} from "../../../DataSource";
import Permission from "../../../models/Permission";

const queries = {
    permissions: () => getPermissions(),
    permission: (context: any,  args: any) => getPermissionById(args._id),
}

const resolvers = {
    role: (args: any) => getRoleById(args.role),
}

const mutations = {

    async addPermission(context: any, args: any) {
        const {permission: {name, role, resource}} = args;
        let permission = new Permission({name, role, resource});
        try {
            await permission.save();
            return await permission;
        } catch(err) {
            throw err;
        }
    },

    updatePermission(context: any, args: any) {
        if (!args._id) return;
        let fields = {...args}
        delete fields.id;
        return Permission.findOneAndUpdate(
            {
                _id: args._id
            },{
                $set: { ...fields }
            }, {new: true}, (err: any, role: any) => {
                if (err) {
                    throw new Error("Se produjo un error al actualizar el permiso")
                }
                return role;
            }
        )
    },

    deletePermission(context: any, {_id}: any) {
        return Permission.findOneAndDelete({_id})
    }

}
export default {
    queries,
    resolvers,
    mutations,
};