const Order = require("../../../models/Order").Orders;
import { IResolvers } from "graphql-tools";

const orderResolvers: IResolvers = {

        orders: (parent, args) => {
            return Order.find({});
        },
        order: (parent, args) => {
            return Order.findById(args.id);
        },


        addOrder({client, domiciliary, store, description, origin, destination}) {
            let order = new Order({client, domiciliary, store, description, origin, destination});
            return order.save();
        },
        updateOrder(parent, args) {
            if (!args.id) return;
            let fields = {...args}
            delete fields.id;
            return Order.findOneAndUpdate(
                {
                    _id: args.id
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
        deleteOrder({id}) {
            return Order.findOneAndDelete({_id: id})
        }

}
export default orderResolvers;