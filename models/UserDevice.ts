import mongoose, {Document} from "mongoose";
import {IUser} from "./User";

export interface IUserDevice extends Document {
  firebaseToken: string;
  user: IUser["_id"];
}

const Schema = mongoose.Schema;
const UserDeviceSchema = new Schema({
  firebaseToken: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

const UserDevice = mongoose.model<IUserDevice>("UserDevice", UserDeviceSchema);
export default UserDevice;