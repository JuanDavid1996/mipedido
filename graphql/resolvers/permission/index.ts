const Permission = require("@models/Permission");
const DataSource = require("@DataSource");

const queries = {
    permissions: () => {
        return Permission.find();
    },
    permission: (args: any) => {
        return Permission.findById(args._id);
    },
}

const resolvers = {
    role: (args: any) => DataSource.getRoleById(args.role),
}

const mutations = {

    async addPermission(args: any) {
        const {permission: {name, role, resource}} = args;
        let permission = new Permission({name, role, resource});
        try {
            await permission.save();
            return await permission;
        } catch(err) {
            throw err;
        }
    },

    updatePermission(args: any) {
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

    deletePermission({_id}: any) {
        return Permission.findOneAndDelete({_id})
    }

}
export default {
    queries,
    resolvers,
    mutations,
};