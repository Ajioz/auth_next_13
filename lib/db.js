import { MongoClient } from "mongodb";

const connectString = process.env.MONGODB_URL;

export const connectDB = async () => {
  try {
    return await MongoClient.connect(connectString);
  } catch (error) {
    console.log("failed to connect to db");
  }
};
