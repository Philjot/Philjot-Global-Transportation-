import mongoose from "mongoose";

export const connectDb = async () => {
    try {
       const conn = await mongoose.connect(process.env.atlas_uri)
       console.log(`MongoDB connected ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error:", error)
    }
}




// // 1. Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("Philjot Database Connected"))
//     .catch(err => console.log(err));