import orderResolvers from "./order";
import categoryResolvers from "./category";
import roleResolvers from "./role";
import permissionResolvers from "./permission";
import userResolvers from "./user";
import storeTypeResolvers from "./storeTypes";


export interface UpdateParams<T> {
    _id: string;
    model: T
}

export default {
    ...orderResolvers,
    ...categoryResolvers,
    ...roleResolvers,
    ...permissionResolvers,
    ...userResolvers,
    ...storeTypeResolvers
}