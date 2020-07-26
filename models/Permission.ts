import mongoose from "mongoose";

const Schema = mongoose.Schema;
const PermissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
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
const Permissions = mongoose.model("Permission", PermissionSchema);
const permissionType = typeof Permissions;
module .exports = {Permissions, PermissionSchema, permissionType};