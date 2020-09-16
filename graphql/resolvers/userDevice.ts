import {
  getRoleById,
  getStoreByOwner,
  getStoreClients,
  getUserById,
  getUserDevice,
  getUserDevices
} from "../../DataSource";
import {verifyCurrentUser, checkPermission} from "../../helpers/authHelpers";
import UserDevice from "../../models/UserDevice";
import { getUserDevicesCache, addToUserDevicesCache, updateUserDevicesCache } from "../../DataSource/cache";
import { PERMISSIONS } from "../../constants";

const queries = {
  userDevices: async (obj: any, args: any, context: any) => {
    verifyCurrentUser(context)
    await checkPermission(PERMISSIONS.LIST_USER_DEVICES, context);
    return getUserDevicesCache()
  }
}

const resolvers = {
  user: (args: any) => getUserById(args.user),
}

const mutations = {
  async updateUserDevice(obj: any, args: any, context: any) {
    verifyCurrentUser(context);
    const token = args.firebaseToken;
    let userDevice: any = await getUserDevice(context.currentUser._id)
    if (!userDevice) {
      userDevice = await UserDevice.create({ user: context.currentUser._id, firebaseToken: token  })
      await addToUserDevicesCache(userDevice);
    } else {
      userDevice.firebaseToken = token;
      await userDevice.save();
      await updateUserDevicesCache(userDevice);
    }
    return userDevice
  }
}
export default  {
  queries,
  resolvers,
  mutations
}