import { Document } from "mongoose";

export default interface IBaseDocument<T extends Document> extends Document {
  cache: (time: number, key?: string) => T;
}