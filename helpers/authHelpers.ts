import {getStoreById} from "../DataSource";

export function verifyCurrentUser(context: any) {
    if (!context.currentUser) throw new Error("Please login");
}
export async function verifyIfStoreBelongsToUser(user: any, storeId: string) {
    if (!storeId) {
        throw Error("storeId invalido");
    }

    const store: any = await getStoreById(storeId);
    const belongs = store.owner.toString() === user._id.toString();
    if (!belongs) {
        throw Error("No autorizado para esta acción");
    }
}