import mongoose, {Document} from "mongoose";
import {IRole} from "./Role";

export interface IPermission extends Document {
    name: string;
    resource: string;
    role: IRole["_id"];
}

const Schema = mongoose.Schema;
const PermissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    resource: {
        type: String,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
});
// mongoose.set("debug", true);
const Permission = mongoose.model<IPermission>("Permission", PermissionSchema);
export default Permission;