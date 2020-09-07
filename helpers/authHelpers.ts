import {getStoreById, getUserWithPermissions} from "../DataSource";
import {IUser} from "../models/User";

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

const getPermissions = async (currentUser: any) => {
  const key = currentUser._id + "_permissions";
  const user: any = (await getUserWithPermissions(currentUser._id) as any).cache(120, key)
  return await user.role.permissions.map((p: any) => p.resource);
}

export async function checkPermission(name: string, currentUser: any) {
  const permissions = await getPermissions(currentUser);
	const hasPermission = permissions.includes(name);
	if (!hasPermission) {
	 	noAuthorized();
	}
}

export async function checkPermissions(names: string[], currentUser: any) {
  const permissions = await getPermissions(currentUser);
  for (let index = 0; index < names.length; index++) {
    const name = names[index];
    const hasPermission = permissions.includes(name);
    if (!hasPermission) noAuthorized()
  }
}