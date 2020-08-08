import mongoose, {Document} from "mongoose";
import {ICategory} from "./Category";
import {IUser} from "./User";
import {IStoreType} from "./StoreType";

export interface IStore extends Document {
    code: string;
    name: string;
    address: string;
    phone: string;
    category: ICategory["_id"];
    storeType: IStoreType["_id"];
    owner: IUser["_id"]
}

const Schema = mongoose.Schema;
const StoreSchema = new Schema({
    code: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    storeType: {
        type: Schema.Types.ObjectId,
        ref: "StoreType",
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Store = mongoose.model<IStore>("Store", StoreSchema);
export default Store;