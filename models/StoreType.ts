import mongoose, {Document} from "mongoose";

export interface IStoreType extends Document {
    name: string;
}

const Schema = mongoose.Schema;
const StoreTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
});

const StoreType = mongoose.model<IStoreType>("StoreType", StoreTypeSchema);
export default StoreType;