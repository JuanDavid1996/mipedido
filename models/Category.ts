import mongoose from "mongoose";

const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
});

const Categories = mongoose.model("Category", CategorySchema);
module.exports = {Categories, CategorySchema};