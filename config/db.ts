import mongoose, {Mongoose} from "mongoose";
import * as process from "process";
export default function connectDB() {

  let uri = "mongodb://localhost:27017/domi";

  if (process.env.NODE_ENV === "production") {
    const {DB_URI} = process.env;
    uri = DB_URI as string;
  }

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