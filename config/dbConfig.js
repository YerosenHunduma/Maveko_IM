import mongoose from "mongoose";

export const connectDb = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.Mongo_Uri);

    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
      resolve();
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error connecting to database: ", err);
      reject(err);
    });
  });
};
