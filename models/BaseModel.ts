import {Document, DocumentQuery, Model} from "mongoose";

export default interface IBaseDocument<T extends Document> extends Document {
  cache(ttl: number, customKey?: string): T;
}

export interface BaseModel<T extends Document> extends Model<T>{
  cache(ttl: number, customKey: string): DocumentQuery<T, any>
}