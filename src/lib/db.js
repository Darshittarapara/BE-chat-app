import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const url = process.env.NODE_ENV == 'production' ?process.env.MONGO_PROD_URI :process.env.MONGO_URI
    console.log(process.env.NODE_ENV,url,'url')
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}