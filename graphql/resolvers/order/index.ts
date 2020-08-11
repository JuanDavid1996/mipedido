import {
    getOrderById,
    getOrders, getOrderStatusById,
    getOrderStatusByName,
    getOrderStatuses,
    getRoleById, getStoreById,
    getStoreByOwner, getStoreClientById, getStoreClients, getUserById
} from "../../../DataSource";
import {verifyCurrentUser} from "../../../helpers/authHelpers";
import Order from "../../../models/Order";

const queries = {
    orders: () => getOrders(),
    order: (obj: any, args: any) => getOrderById(args._id),
}

const resolvers = {
    store: (args: any) => getStoreById(args.store),
    domiciliary: (args: any) => getUserById(args.domiciliary),
    client: (args: any) => getStoreClientById(args.client),
    status: (args: any) => getOrderStatusById(args.status),
}

const mutations = {

    async addOrder(obj: any, { order }: any, context: any) {
        verifyCurrentUser(context);
        const role: any = await getRoleById(context.currentUser.role);
        let store: string = order.store;
        let storeModel: any = undefined;

        if (role.name === "Tendero") {
            storeModel = await (getStoreByOwner(context.currentUser) as any);
            store = storeModel._id;
        } else if (role.name !== "Admin") {
            throw Error("No autorizado");
        }

        if (!store || store.trim() === "") {
            throw Error("Parametros incompletos");
        }

        if (!storeModel) storeModel = await getStoreById(store);

        const { client, description, destination } = order;
        const status:string = (await getOrderStatusByName("Pendiente") as any)._id;
        const origin:string = storeModel.address;

        return new Order({client, store, description, destination, status, origin}).save();
    },
    updateOrder(obj: any, {_id, resource}: any, context: any) {
        verifyCurrentUser(context);
        if (!_id) return;
        return Order.findOneAndUpdate(
            {
                _id
            },{
                $set: { resource }
            }, {new: true}, (err: any, order: any) => {
                if (err) {
                    throw new Error("Se produjo un error al actualizar la categoria")
                }
                return order;
            }
        )
    },
    deleteOrder(obj: any, {_id}: any, context: any) {
        verifyCurrentUser(context);
        return Order.findOneAndDelete({_id})
    }

}
export default {
    queries,
    resolvers,
    mutations
};