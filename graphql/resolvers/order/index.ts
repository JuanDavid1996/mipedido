import {
    getOrderById,
    getOrders,
    getOrderStatusById,
    getOrderStatusByName,
    getRoleById,
    getStoreById,
    getStoreClientById,
    getUserById,
    getUserDevices,
    getOrdersAvailable,
    getUserDeviceByIds,
} from "../../../DataSource";
import {
    verifyCurrentUser,
    verifyIfStoreBelongsToUser,
    checkPermission
} from "../../../helpers/authHelpers";
import {notifyNewOrder, notifyOrderTaken} from "../../../helpers/notification";
import Order, {IOrder} from "../../../models/Order";
import {BASE_ROLES, ORDER_FIELDS, ORDER_STATUS, ORDER_STATUS_FIELDS, PERMISSIONS} from "../../../constants";



const queries = {
    orders: () => getOrders(),
    order: (obj: any, args: any) => getOrderById(args._id),
    ordersAvailable: (obj: any, args: any, context: any) => getOrdersAvailable(),
}

const resolvers = {
    store: (args: any) => getStoreById(args.store),
    domiciliary: (args: any) => getUserById(args.domiciliary),
    client: (args: any) => getStoreClientById(args.client),
    status: (args: any) => getOrderStatusById(args.status),
}

const mutations = {

    async addOrder(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        const role: any = await getRoleById(context.currentUser.role);
        let store: string = args.order.store;
        let storeModel: any = undefined;

        if (role.name === BASE_ROLES.TENDERO) {
            await verifyIfStoreBelongsToUser(context.currentUser, store);
        } else if (role.name !== BASE_ROLES.ADMIN) {
            throw Error("No autorizado");
        }

        if (store === undefined || store.trim() === "") {
            throw Error("Parametros incompletos");
        }

        if (!args.order.client || args.order.client.trim() === "" ) {
            throw Error("Parametros incompletos");
        }

        storeModel = await getStoreById(store);

        const { client, description, destination } = args.order;
        const status:string = (await getOrderStatusByName(ORDER_STATUS.PENDIENTE) as any)._id;
        const origin:string = storeModel.address;

        const newOrder = new Order({client, store, description, destination, status, origin})
        await newOrder.save();

        const uDevices: any = await getUserDevices()
        const registrationIds = uDevices.map((ud: any) => ud.firebaseToken);

        await notifyNewOrder(registrationIds, newOrder);
        return newOrder;
    },
    updateOrder(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        console.log(args)
        if (!args.order._id) return;
        const _id = args.order._id;
        const params = args.order;
        delete params._id;

        return Order.findOneAndUpdate(
            {
                _id
            },{
                $set: { ...params }
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
    },
    async takeOrder(obj: any, {_id, domiciliary}: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.TAKE_ORDER, context.currentUser);
        const order:IOrder | null = await getOrderById(_id).populate(ORDER_STATUS_FIELDS.STATUS).exec();

        if (order === null) {
            throw new Error("Pedido no valido")
        }

        if (order.status.name !== ORDER_STATUS.PENDIENTE) {
            throw new Error("El pedido ha sido tomado");
        }

        order.status = (await getOrderStatusByName(ORDER_STATUS.TOMADO) as any)._id;
        order.domiciliary = (await  getUserById(domiciliary) as any)._id;
        await order.save()

        const store: any = await getStoreById(order.store).populate(ORDER_FIELDS.OWNER).exec()
        const owner = store.owner._id

        const uDevices: any = await getUserDeviceByIds([owner, order.domiciliary])
        const registrationIds = uDevices.map((ud: any) => ud.firebaseToken);

        await notifyOrderTaken(registrationIds);

        return order;
    },

}
export default {
    queries,
    resolvers,
    mutations
};