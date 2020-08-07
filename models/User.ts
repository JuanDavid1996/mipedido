import mongoose from "mongoose";
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const user: any = this;
        const salt = await  bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(user.password, salt);
        return next();
    } catch (e) {
        return next(e);
    }
})

UserSchema.methods.validatePassword = async function(data: string) {
    return bcrypt.compare(data, this.password);
}

const User = mongoose.model("User", UserSchema);
export default User;