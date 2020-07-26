import mongoose from "mongoose";

const Schema = mongoose.Schema;
const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
        	unique: true
        }
    },
});

const Roles = mongoose.model("Role", RoleSchema);
module .exports = {Roles, RoleSchema};