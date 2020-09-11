import {
    getOrdersByDomiciliary,
    getOrderByDomiciliaryWithStatus,
    getOrderById,
    getOrders,
    getOrdersAvailable,
    getOrderStatusById,
    getOrderStatusByName,
    getRoleById,
    getStoreById,
    getStoreClientById,
    getUserById,
    getUserDeviceByIds,
    getUserDevices,
    getOrdersByStore,
} from "../../../DataSource";
import {
    checkPermission,
    checkPermissions,
    verifyCurrentUser,
    verifyIfStoreBelongsToUser
} from "../../../helpers/authHelpers";
import {notifyNewOrder, notifyOrderTaken} from "../../../helpers/notification";
import Order, {IOrder} from "../../../models/Order";
import {BASE_ROLES, ORDER_FIELDS, ORDER_STATUS, ORDER_STATUS_FIELDS, PERMISSIONS} from "../../../constants";
import {
    getOrdersCache,
    getUserDevicesCache,
    addOrdersCache,
    addAvailableOrdersCache,
    getAvailableOrdersCache,
    removeAvailableOrdersCache,
    getOrdersByStoreCache,
    getOrdersByClientCache,
    getOrdersByDomiciliaryCache,
    addOrdersByDomiciliaryCache,
    addOrdersByStoreCache,
    removeOrdersCache
} from "../../../DataSource/cache";

const queries = {
    orders: async (obj: any, args: any, context: any) => {
        verifyCurrentUser(context)

        if (args.domiciliary) {
            await checkPermission(PERMISSIONS.LIST_ORDERS_BY_DOMICILIARY, context)
            return getOrdersByDomiciliaryCache(args.domiciliary);
        }

        if (args.store) {
            await checkPermission(PERMISSIONS.LIST_ORDERS_BY_STORE, context)
            return getOrdersByStoreCache(args.store);
        }

        if (args.client) {
            await checkPermission(PERMISSIONS.LIST_ORDERS_BY_CLIENT, context)
            return getOrdersByClientCache(args.client);
        }

        await checkPermissions([
            PERMISSIONS.LIST_ORDERS_BY_STORE,
            PERMISSIONS.LIST_ORDERS_BY_DOMICILIARY,
            PERMISSIONS.LIST_ORDERS_BY_CLIENT
        ], context);

        return getOrdersCache();
    },
    order: async (obj: any, args: any, context: any) => {
        verifyCurrentUser(context)
        await checkPermission(PERMISSIONS.SHOW_ORDER, context);
        return getOrderById(args._id)
    },
    async ordersAvailable(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.TAKE_ORDER, context);
        return getAvailableOrdersCache()
    },
    async currentOrder(obj: any, args: any, context: any) {
        verifyCurrentUser(context)
        await checkPermission(PERMISSIONS.CURRENT_ORDER, context)

        if (args.domiciliary !== context.currentUser._id) {
            const permissions = [PERMISSIONS.VERIFY_CURRENT_ORDER]
            await checkPermissions(permissions, context)
        }
        const orderTaken = await getOrderByDomiciliaryWithStatus(args.domiciliary, ORDER_STATUS.TOMADO)
        const orderInProgress = await getOrderByDomiciliaryWithStatus(args.domiciliary, ORDER_STATUS.EN_CURSO)

        if (!orderInProgress && !orderTaken) {
            throw Error("No tiene pedido en curso");
        }

        if (orderTaken) return orderTaken
        return orderInProgress
    }
}

const resolvers = {
    store: (root: any, args: any, context: any) => {
        //TODO: CHECK PERMISSION
        return getStoreById(root.store)
    },
    domiciliary: (args: any) => getUserById(args.domiciliary),
    client: (args: any) => getStoreClientById(args.client),
    status: (args: any) => getOrderStatusById(args.status),
}

const mutations = {

    async addOrder(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.ADD_ORDER, context);

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

        await addOrdersCache(newOrder);
        await addOrdersByStoreCache(storeModel._id, newOrder);
        await addAvailableOrdersCache(newOrder);

        const uDevices: any = await getUserDevicesCache()

        const registrationIds = uDevices.filter((uDevice: any) => uDevice.user.role).map((ud: any) => ud.firebaseToken);
        await notifyNewOrder(registrationIds, newOrder);
        return newOrder;
    },
    async updateOrder(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.UPDATE_ORDER, context)
        if (!args.order._id) return;
        const _id = args.order._id;
        const params = args.order;
        delete params._id;

        return Order.findOneAndUpdate(
            { _id },{ $set: { ...params } }, {new: true}, (err: any, order: any) => {
                if (err) throw new Error("Se produjo un error el pedido")
                return order;
            }
        )
    },
    async deleteOrder(obj: any, {_id}: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.DELETE_ORDER, context)
        const order = await Order.findOneAndDelete({_id}) as IOrder;
        await removeOrdersCache(order);
        await removeAvailableOrdersCache(order);
        return order;
    },
    async takeOrder(obj: any, {_id, domiciliary}: any, context: any) {
        verifyCurrentUser(context);
        await checkPermission(PERMISSIONS.TAKE_ORDER, context);
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

        await removeAvailableOrdersCache(order)
        await addOrdersByDomiciliaryCache(domiciliary, order);

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