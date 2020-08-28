import User from "../../models/User";
import {getPermissionByRole, getRoleById, getStoreByOwner, getStoresByOwner} from "../../DataSource";
import {BASE_ROLES} from "../../constants";
import jwt from "jsonwebtoken";
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

  delete user.password;
  jsonResponse.user = user;
  jsonResponse.user.role = role;

  jsonResponse.token = generateToken(user._id);

  res.send({
    success: true,
    response: jsonResponse
  });
}