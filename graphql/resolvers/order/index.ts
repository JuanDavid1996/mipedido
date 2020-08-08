import {getOrderById, getOrders} from "../../../DataSource";

const Order = require("../../../models/Order").Orders;

const queries = {
    orders: () => getOrders(),
    order: (context: any, args: any) => getOrderById(args._id),
}

const mutations = {

    addOrder(context: any, {client, store, description, destination}: any) {
        let order = new Order({client, store, description, destination});
        return order.save();
    },
    updateOrder(context: any, args: any) {
        if (!args._id) return;
        let fields = {...args}
        delete fields.id;
        return Order.findOneAndUpdate(
            {
                _id: args._id
            },{
                $set: { ...fields }
            }, {new: true}, (err: any, order: any) => {
                if (err) {
                    throw new Error("Se produjo un error al actualizar la categoria")
                }
                return order;
            }
        )
    },
    deleteOrder(context: any, {_id}: any) {
        return Order.findOneAndDelete({_id})
    }

}
export default {
    queries,
    mutations
};