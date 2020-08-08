import mongoose, {Document} from "mongoose";
import {IClient} from "./Client";
import {IUser} from "./User";
import {IStore} from "./Store";
import {IOrderStatus} from "./OrderStatus";

export interface IOrder extends Document {
    client: IClient["_id"];
    domiciliary: IUser["_id"];
    store: IStore["_id"];
    status: IOrderStatus["_id"];
    description: string;
    origin: string;
    destination: string;
}

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
    status: {
        type: Schema.Types.ObjectId,
        ref: "OrderStatus",
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

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;