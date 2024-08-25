import { MongoClient } from "mongodb";


const connectString = process.env.MONGODB_URL;;

const connectDB = () => {
    MongoClient.connect(connectString);
}