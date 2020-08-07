import StoreType from "../../../models/StoreType";

const queries = {
    storeTypes: () => {
        return StoreType.find();
    },
}

const mutations = {

    async addStoreType(args: any) {
        const { name } = args;
        let storeType = new StoreType({name});
        return await storeType.save();
    },
    updateStoreType(args: any) {
        if (!args._id) return;
        let fields = {...args}
        delete fields._id;
        return StoreType.findOneAndUpdate(
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
    deleteStoreType({_id}: any) {
        return StoreType.findOneAndDelete({_id})
    }

}
export default {
    queries,
    mutations
};