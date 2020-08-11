import mongoose, {Document} from "mongoose";

export interface IPermission extends Document {
  resource: string;
}

const Schema = mongoose.Schema;
const PermissionSchema = new Schema({
  resource: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
});

const Permission = mongoose.model<IPermission>("Permission", PermissionSchema);
export default Permission;