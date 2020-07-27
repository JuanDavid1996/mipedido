import { IResolvers } from "graphql-tools";
import {DocumentQuery} from "mongoose";
const StoreType = require("../../../models/StoreType").StoreTypes;


const storeTypeResolvers: IResolvers = {

    storeTypes: (args) => {
        return StoreType.find({});
    },
    permission: (args) => {
      return StoreType.findById(args._id);  
    },

    async addStoreType(args) {
        const { name } = args;
        let storeType = new StoreType({name});
        return await storeType.save();
    },
    updateStoreType(args) {
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
    deleteStoreType({id}) {
        return StoreType.findOneAndDelete({_id: id})
    }

}
export default storeTypeResolvers;