import mongoose from "mongoose";

const Schema = mongoose.Schema;
const StoreSchema = new Schema({
    code: {
        type: String,
        required: true
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
    }
});

const Store = mongoose.model("Store", StoreSchema);
module .exports = {Store, StoreSchema};