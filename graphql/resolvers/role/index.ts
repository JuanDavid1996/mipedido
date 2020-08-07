import Role from "../../../models/Role";
import Permission from "../../../models/Permission";


const queries = {
    roles: () => {
        return Role.find();
    },
    role: (args: any) => {
        return Role.findById(args._id);
    }
}

const resolvers = {
    permissions: (args: any) => {
        return Permission.find({ role: args._id });
    }
}

const mutations = {

    addRole({name}: any) {
        let role = new Role({name});
        return role.save();
    },
    updateRole(args: any) {
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
    deleteRole({id}: any) {
        return Role.findOneAndDelete({_id: id})
    }

}
export default {
    queries,
    resolvers,
    mutations,
};