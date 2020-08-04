import mongoose from "mongoose";

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

const Stores = mongoose.model("Store", StoreSchema);
module .exports = {Stores, StoreSchema};