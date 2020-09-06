import {getRoleById, getStoreByOwner, getStoreClients, getUserById} from "../../DataSource";
import Client from "../../models/Client";
import {verifyCurrentUser, verifyIfStoreBelongsToUser} from "../../helpers/authHelpers";
import {BASE_ROLES} from "../../constants";

const queries = {
    storeClients: (obj: any, { store, code, firstName, phone }: any, context: any) => {
        return getStoreClients(store, code, firstName, phone)
    }
}

const resolvers = {
    user: (args: any) => getUserById(args.user),
}

const mutations = {
    async addStoreClient(obj: any, data: any, context: any) {
        console.log(data)
        const { client } = data;

        verifyCurrentUser(context);
        const role: any = await getRoleById(context.currentUser.role);
        let store: string = client.store;

        if (role.name === BASE_ROLES.TENDERO) {
            await verifyIfStoreBelongsToUser(context.currentUser, store);
        } else if (role.name !== BASE_ROLES.ADMIN) {
            throw Error("No autorizado");
        }

        if ( store === undefined || store.trim() === "") {
            throw Error("Parametros incompletos");
        }

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