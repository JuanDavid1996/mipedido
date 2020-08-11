import Role from "../../../models/Role";
import {getPermissionById, getPermissionByKeys, getRoleById, getRoles} from "../../../DataSource";
import {verifyCurrentUser} from "../../../helpers/authHelpers";

const queries = {
    roles: () => getRoles(),
    role: (context: any, args: any) => getRoleById(args._id),
}

const resolvers = {
    permissions: async (args: any, context: any) => {
        return getPermissionByKeys(args.permissions)
    },
}

const mutations = {

    addRole(obj: any, {name}: any, context: any) {
        verifyCurrentUser(context);
        return Role.create({name, permissions: []});
    },
    updateRole(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        if (!args._id) return;
        return Role.findOneAndUpdate({_id: args._id }, { $set: { name: args.name } });
    },
    deleteRole(obj: any, {_id}: any, context: any) {
        verifyCurrentUser(context);
        return Role.findOneAndDelete({_id: _id})
    },
    async addPermissionToRole(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        const role: any = await getRoleById(args._id);
        if ( role.permissions.indexOf(args.permission) === -1) {
            role.permissions.push(await getPermissionById(args.permission))
            await role.save();
        }
        return role;
    },
    async removePermissionToRole(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
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