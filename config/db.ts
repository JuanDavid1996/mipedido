import mongoose, {Mongoose} from "mongoose";
import * as process from "process";
const MongooseCache = require('mongoose-redis');

export default function connectDB() {

  let uri = "mongodb://localhost:27017/domi";

  if (process.env.NODE_ENV === "production") {
    const {DB_USERNAME, DB_PASSWORD} = process.env;
    uri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds155243.mlab.com:55243/mipedido`;
  }

  MongooseCache(mongoose, "redis://127.0.0.1:6379");

  return new Promise((resolve, rejected) => {
    mongoose
      .connect(
        uri,
        {useNewUrlParser: true, useUnifiedTopology: true})
      .then((con: Mongoose) => {
        resolve();
      }).catch((error: any) => {
      rejected(error);
    });
  })
}