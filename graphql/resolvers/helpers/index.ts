import { getStoreById, getUserById, getStoreClientById, getOrderStatusById } from "../../../DataSource";

//TODO: VERIFY PERMISSIONS!
export default {
    store: (args: string) => {
        return getStoreById(args)
    },
    domiciliary: (args: string) => {
        return getUserById(args)
    },
    client: (args: string) => {
        return getStoreClientById(args)
    },
    status: (args: string) => {
        return getOrderStatusById(args)
    },
}