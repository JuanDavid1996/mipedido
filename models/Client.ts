import mongoose, {Document} from "mongoose";
import {IUser} from "./User";
import {IStore} from "./Store";

export interface IClient extends Document {
    code: string;
    firstName: string;
    lastName: string;
    phone: string;
    user: IUser["_id"];
    store: IStore["_id"];
}

const Schema = mongoose.Schema;
const ClientSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
    }
})

const Client = mongoose.model<IClient>("Client", ClientSchema);
export default Client;