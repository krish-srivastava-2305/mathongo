import mongoose from "mongoose"

// This code connects to a MongoDB database using Mongoose.
// It exports a function that takes a MongoDB URI as an argument and attempts to connect to the database.
const connectDB = async (uri) => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;