import Role from "../../../models/Role";
import Permission from "../../../models/Permission";
import {getPermissionByRole, getRoleById, getRoles} from "../../../DataSource";


const queries = {
    roles: () => getRoles(),
    role: (context: any, args: any) => getRoleById(args._id),
}

const resolvers = {
    permissions: (args: any) => getPermissionByRole(args._id),
}

const mutations = {

    addRole(context: any, {name}: any) {
        let role = new Role({name});
        return role.save();
    },
    updateRole(context: any, args: any) {
        if (!args._id) return;
        let fields = {...args}
        delete fields._id;
        return Role.findOneAndUpdate(
            {
                _id: args._id
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
    deleteRole(context: any, {_id}: any) {
        return Role.findOneAndDelete({_id: _id})
    }

}
export default {
    queries,
    resolvers,
    mutations,
};