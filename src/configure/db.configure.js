import mongoose from "mongoose"

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