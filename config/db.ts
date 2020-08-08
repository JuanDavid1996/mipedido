import mongoose, {Mongoose} from "mongoose";
export default function connectDB() {
  return new Promise((resolve, rejected) => {
    mongoose
      .connect(
        'mongodb://localhost:27017/domi',
        {useNewUrlParser: true, useUnifiedTopology: true})
      .then((con: Mongoose) => {
        resolve();
      }).catch(error => {
      rejected(error);
    });
  })
}