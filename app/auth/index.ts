import User from "../../models/User";
import {getOrdersByDomiciliary, getRoleById, getStoresByOwner} from "../../DataSource";
import {BASE_ROLES} from "../../constants";
import {generateToken} from "../../graphql/resolvers/auth";

export const login = async (req: any, res: any) => {
  const { username, password } = req.body;
  const user: any = await User.findOne({username});

  if (!user || !await user.validatePassword(password)) {
    return res.send({
      success: false,
      error: "Usuario o contraseña errada"
    });
  }

  const role: any = await getRoleById(user.role).populate("permissions").exec();
  const jsonResponse: any = {}

  if (role.name === BASE_ROLES.TENDERO) {
    jsonResponse.stores = await getStoresByOwner(user._id);
  }
  if (role.name === BASE_ROLES.DOMICILIARIO) {
    jsonResponse.orders = await getOrdersByDomiciliary(user._id)
      .populate({
        path: "store",
        populate: "owner"
      })
      .populate("client")
      .populate("status")
      .exec()
  }

  const { _id, firstName, lastName, phone } = user;
  jsonResponse.user = { _id, firstName, lastName, phone, role: {} };
  delete jsonResponse.user.password

  jsonResponse.user.role._id = role._id
  jsonResponse.user.role.name = role.name
  jsonResponse.user.role.permissions = role.permissions.map((p: any) => ({ _id: p._id, resource: p.resource }))

  jsonResponse.token = generateToken(user._id);

  res.send({
    success: true,
    response: jsonResponse
  });
}

export const checkToken = async (req: any, res: any)  => {

}