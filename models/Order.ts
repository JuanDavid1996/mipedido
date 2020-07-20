import mongoose from "mongoose";

const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    domiciliary: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        required: String
    },
    destination: {
        type: String,
        required: String
    }
});

const Orders = mongoose.model("Order", OrderSchema);
module.exports = {Orders, OrderSchema};