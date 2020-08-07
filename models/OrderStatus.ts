import mongoose from "mongoose";

const Schema = mongoose.Schema;
const OrderStatusSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
});

const OrderStatus = mongoose.model("OrderStatus", OrderStatusSchema);
export default OrderStatus;