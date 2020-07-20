import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    verified: {
        type: Boolean,
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    }
});

const Users = mongoose.model("Client", UserSchema);
module .exports = {Users, UserSchema};