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

const StoreType = mongoose.model("StoreType", StoreTypeSchema);
export default StoreType;