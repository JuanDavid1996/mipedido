import mongoose, {Document} from "mongoose";
import {ICategory} from "./Category";

export interface ISuggestedStore extends Document {
  name: string;
  address: string;
  phone: string;
  owner: string;
  category: ICategory["_id"];
}

const Schema = mongoose.Schema;
const SuggestedStoreSchema = new Schema({
  name: {
    type: String,
      required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    require: true
  },
  owner: {
    type: String,
    require: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  }
});

const SuggestedStore = mongoose.model<ISuggestedStore>("SuggestedStore", SuggestedStoreSchema);
export default SuggestedStore;