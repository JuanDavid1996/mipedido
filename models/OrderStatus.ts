import mongoose, {Document} from "mongoose";

export interface IOrderStatus extends Document {
    name: string;
}

const Schema = mongoose.Schema;
const OrderStatusSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
});

const OrderStatus = mongoose.model<IOrderStatus>("OrderStatus", OrderStatusSchema);
export default OrderStatus;