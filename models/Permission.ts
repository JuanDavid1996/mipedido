import mongoose from "mongoose";

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
const Permission = mongoose.model("Permission", PermissionSchema);
export default Permission;