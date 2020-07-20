import mongoose from "mongoose";

const Schema = mongoose.Schema;
const PermissionSchema = new Schema({
    name: {
        type: String,
        required: true
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

const Permissions = mongoose.model("Permission", PermissionSchema);
module .exports = {Permissions, PermissionSchema};