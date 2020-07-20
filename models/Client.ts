import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ClientSchema = new Schema({
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
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

const Clients = mongoose.model("Client", ClientSchema);
module .exports = {Clients, ClientSchema};