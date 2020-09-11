import { getStoreById, getUserById, getStoreClientById, getOrderStatusById } from "../../../DataSource";
import { checkPermission } from "../../../helpers/authHelpers";
import { PERMISSIONS } from "../../../constants";

//TODO: VERIFY PERMISSIONS!
export default {
    store: async (args: string, context: any) => {
        return getStoreById(args)
    },
    domiciliary: (args: string) => {
        return getUserById(args)
    },
    client: async (args: string, context: any) => {
        await checkPermission(PERMISSIONS.SHOW_STORE_CLIENT, context);
        return getStoreClientById(args)
    },
    status: (args: string) => {
        return getOrderStatusById(args)
    },
}