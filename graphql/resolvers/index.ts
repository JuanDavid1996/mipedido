import orderResolvers from "./order";
import categoryResolvers from "./category";
import roleResolvers from "./role";
import permissionResolvers from "./permission";

export default {
    ...orderResolvers,
    ...categoryResolvers,
    ...roleResolvers,
    ...permissionResolvers
}