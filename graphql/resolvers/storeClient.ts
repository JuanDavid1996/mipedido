import {getRoleById, getStoreByOwner, getStoreClients, getUserById} from "../../DataSource";
import Client from "../../models/Client";
import {verifyCurrentUser} from "../../helpers/authHelpers";

const queries = {
    storeClients: (obj: any, args: any) => getStoreClients(args.store)
}

const resolvers = {
    user: (obj: any, args: any) => getUserById(args.user),
}

const mutations = {
    async addStoreClient(obj: any, { client }: any, context: any) {
        verifyCurrentUser(context);
        const role: any = await getRoleById(context.currentUser.role);
        let store: string = client.store;
        if (role.name === "Tendero") {
            store = await (getStoreByOwner(context.currentUser) as any)._id;
        } else if (role.name !== "Admin") {
            throw Error("No autorizado");
        }

        if (!store || store.trim() === "") {
            throw Error("Parametros incompletos");
        }
        console.log("store ", store);
        //TODO GET STORE ID BY CLIENT,
        // IF CLIENT HAS MANY STORE HE SHOULD BE SEND THE STORE ID,
        // BY DEFAULT THE SYSTEM WILL TO TAKE THE FIRST STORE CREATED!
        const params: any = {...client, store: store};
        return Client.create(params);
    },

    updateStoreClient(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
    }
}

export default {
    queries,
    resolvers,
    mutations,
}