import {
  getRoleById,
  getStoreByOwner,
  getStoreClients,
  getUserById,
  getUserDevice,
  getUserDevices
} from "../../DataSource";
import {verifyCurrentUser} from "../../helpers/authHelpers";
import UserDevice from "../../models/UserDevice";

const queries = {
  userDevices: (obj: any, args: any) => getUserDevices()
}

const resolvers = {
  user: (obj: any, args: any) => getUserById(args.user),
}

const mutations = {
  async updateUserDevice(obj: any, args: any, context: any) {
    verifyCurrentUser(context);
    const token = args.firebaseToken;
    let userDevice = await getUserDevice(context.currentUser._id)
    if (!userDevice) {
      return await UserDevice.create({ user: context.currentUser._id, firebaseToken: token  })
    }
    userDevice.firebaseToken = token;
    userDevice.save()

    return userDevice
  }
}
export default  {
  queries,
  resolvers,
  mutations
}