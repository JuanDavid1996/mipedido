import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
}

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

const Category = mongoose.model<ICategory>("Category", CategorySchema);
export default Category;