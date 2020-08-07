import mongoose from "mongoose";

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

const Client = mongoose.model("Client", ClientSchema);
export default Client;