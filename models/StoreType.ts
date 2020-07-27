import mongoose from "mongoose";

const Schema = mongoose.Schema;
const StoreTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
});

const StoreTypes = mongoose.model("StoreType", StoreTypeSchema);
module .exports = {StoreTypes, StoreTypeSchema};