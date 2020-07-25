const Role = require("../../../models/Role").Roles;
import { IResolvers } from "graphql-tools";

const roleResolvers: IResolvers = {

    roles: () => {
        return Role.aggregate([
            { $lookup: { from: "permissions", localField: "_id", foreignField: "role", as: "permissions" } }
        ]).exec()
    },
    role: (parent, args) => {
        return Role.findById(args.id);
    },


    addRole({name}) {
        let role = new Role({name});
        return role.save();
    },
    updateRole(parent, args) {
        if (!args.id) return;
        let fields = {...args}
        delete fields.id;
        return Role.findOneAndUpdate(
            {
                _id: args.id
            },{
                $set: { ...fields }
            }, {new: true}, (err: any, role: any) => {
                if (err) {
                    throw new Error("Se produjo un error al actualizar el rol")
                }
                return role;
            }
        )
    },
    deleteRole({id}) {
        return Role.findOneAndDelete({_id: id})
    }

}
export default roleResolvers;