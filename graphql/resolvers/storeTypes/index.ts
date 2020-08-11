import StoreType from "../../../models/StoreType";
import {getStoreTypes} from "../../../DataSource";
import {verifyCurrentUser} from "../../../helpers/authHelpers";

const queries = {
    storeTypes: () => getStoreTypes(),
}

const mutations = {

    async addStoreType(args: any) {
        const { name } = args;
        let storeType = new StoreType({name});
        return await storeType.save();
    },
    updateStoreType(obj: any, {_id, name}: any, context: any) {
        verifyCurrentUser(context);
        if (!_id) return;
        return StoreType.findOneAndUpdate(
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
    deleteStoreType(obj: any, {_id}: any, context: any) {
        verifyCurrentUser(context);
        return StoreType.findOneAndDelete({_id})
    }

}
export default {
    queries,
    mutations
};