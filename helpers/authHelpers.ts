import {getStoreById, getUserWithPermissions} from "../DataSource";

const noAuthorized = () => {
	throw Error("No autorizado");
}


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
        noAuthorized();
    }
}

export async function checkPermission(name: string, currentUser: any) {
	const user: any = await getUserWithPermissions(currentUser._id);
	const permissions = user.role.permissions.map((p: any) => p.resource);
	const hasPermission = permissions.includes(name);
	if (!hasPermission) {
	 	noAuthorized();
	}
}