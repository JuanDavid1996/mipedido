import mongoose, {Document, Model} from "mongoose";
import {IRole} from "./Role";
const bcrypt = require('bcrypt');
const saltRounds = 10;

export interface IUser extends Document {
    code: string;
    firstName: string;
    lastName: string;
    phone: string;
    verified: boolean;
    username: string;
    password: string;
    role: IRole["_id"];
}

export interface IUserModel extends Model<IUser> {
    validatePassword: (password: string) => Promise<boolean>;
}

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    code: {
        type: String,
        required: true,
        index: true,
        unique: true,
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
        require: true,
        unique: true
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
}, {
    timestamps: true
});

UserSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await  bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (e) {
        return next(e);
    }
})

UserSchema.methods.validatePassword = async function(data: string) {
    return bcrypt.compare(data, this.password);
}

const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
export default User;