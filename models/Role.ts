import mongoose, {Document, Model} from "mongoose";
import {IPermission} from "./Permission";

export interface IRole extends Document {
    _id: Document["_id"];
    name: string;
    permissions: Array<IPermission["_id"]>;
}

export interface IRoleModel extends Model<IRole> {}

const Schema = mongoose.Schema;
const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    }]
});

const Role = mongoose.model<IRole>("Role", RoleSchema);
export default Role;