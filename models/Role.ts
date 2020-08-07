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

const Role = mongoose.model("Role", RoleSchema);
export default Role;