import { IResolvers } from "graphql-tools";
import {DocumentQuery} from "mongoose";
const Permission = require("../../../models/Permission").Permissions;

const withPopulate = (query: DocumentQuery<any, any>) => {
    return query.populate({path: "role", model: "Role"}).exec();
}

const permissionResolvers: IResolvers = {

    permissions: (parent, args) => {
        return withPopulate(Permission.find({}));
    },
    permission: (parent, args) => {
        return withPopulate(Permission.findById(args.id));
    },

    async addPermission(args) {
        const {permission: {name, role, resource}} = args;
        let permission = new Permission({name, role, resource});
        try {
            await permission.save();
            return await permission.populate("role").execPopulate();
        } catch(err) {
            throw err;
        }
    },
    updatePermission(parent, args) {
        if (!args.id) return;
        let fields = {...args}
        delete fields.id;
        return Permission.findOneAndUpdate(
            {
                _id: args.id
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
    deletePermission({id}) {
        return Permission.findOneAndDelete({_id: id})
    }

}
export default permissionResolvers;