import mongoose from "mongoose";
// const port = process.env.PORT || 5000;
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        };
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Successfully connected to MongoDB 👍✔ `);
        
    } catch (error) {
        console.error(`ERROR : ${error.message}`);
        process.exit(1);
    } 
};

export default connectDB;