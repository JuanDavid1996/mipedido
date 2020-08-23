import orderModule from "./order";
import categoryModule from "./category";
import roleModule from "./role";
import permissionModule from "./permission";
import userModule from "./user";
import storeTypeModule from "./storeTypes";
import storeModule from "./store";
import orderStatusModule from "./orderStatus";
import storeClient from "./storeClient";
import authModule from "./auth";
import userDeviceModule from "./userDevice";
import suggestedStore from "./suggestedStore";

export default {
    Query: {
        ...userModule.queries,
        ...storeModule.queries,
        ...roleModule.queries,
        ...permissionModule.queries,
        ...categoryModule.queries,
        ...storeTypeModule.queries,
        ...orderModule.queries,
        ...orderStatusModule.queries,
        ...storeClient.queries,
        ...userDeviceModule.queries,
        ...suggestedStore.queries,
    },
    Mutation: {
        ...userModule.mutations,
        ...storeModule.mutations,
        ...roleModule.mutations,
        ...permissionModule.mutations,
        ...categoryModule.mutations,
        ...storeTypeModule.mutations,
        ...orderModule.mutations,
        ...orderStatusModule.mutations,
        ...storeClient.mutations,
        ...authModule.mutations,
        ...userDeviceModule.mutations,
        ...suggestedStore.mutations,
    },
    User: { ...userModule.resolvers },
    Store: { ...storeModule.resolvers },
    Role: { ...roleModule.resolvers },
    Permission: { ...permissionModule.resolvers },
    Category: {},
    StoreType: {},
    Order: { ...orderModule.resolvers },
    OrderStatus: {},
    //StoreClient
    Client: { ...storeClient.resolvers },
    UserDevice: { ...userDeviceModule.resolvers },
    SuggestedStore: { ...suggestedStore.resolvers },
}