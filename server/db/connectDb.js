import mongoose from "mongoose";

const db_uri = process.env.DB_ATLAS_CONNECTION_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(db_uri);
    console.log("db connected");
  } catch (error) {
    console.log("db connection error", error);
    process.exit(1); // Exit process with failure code
  }
};
export default connectDb;
