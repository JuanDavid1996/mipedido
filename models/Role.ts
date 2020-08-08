import mongoose, {Document, Model} from "mongoose";

export interface IRole extends Document {
    _id: Document["_id"];
    name: string;
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
});

const Role = mongoose.model<IRole>("Role", RoleSchema);
export default Role;