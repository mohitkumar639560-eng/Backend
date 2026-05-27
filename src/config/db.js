import mongoose from 'mongoose';


async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/kodex")
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
}


export default connectDB;