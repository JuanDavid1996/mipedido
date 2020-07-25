import orderResolvers from "./order";
import categoryResolvers from "./category";
import roleResolvers from "./role";
import permissionResolvers from "./permission";
import userResolvers from "./user";

export default {
    ...orderResolvers,
    ...categoryResolvers,
    ...roleResolvers,
    ...permissionResolvers,
    ...userResolvers,
}