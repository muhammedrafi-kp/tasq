import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const mongo_URI = process.env.MONGO_URI;
    if (!mongo_URI) {
        console.error('MongoDB URI is not defined in the .env!');
        process.exit(1);
    }
    try {
        await mongoose.connect(mongo_URI);
        console.log("MongoDB connected success fully✅");
    } catch (error) {
        console.log(`MongoDB conncetion error : ${(error as Error).message}`);
        process.exit(1);
    }
}

export default connectDB;