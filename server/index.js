import express from "express";
import dotenv from "dotenv"
import { connectDb } from "./lib/dbase.js";
import BookingRouter from "./routes/bookingRoutes.js";
import cors from "cors"
import adminRoutes from './routes/adminRoute.js';




const app = express();
app.use(express.json())
app.use(cors());
dotenv.config()
const PORT = process.env.PORT
app.use('/api/v1/booking', BookingRouter);
app.use('/api/v1/admin', adminRoutes);


app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT)
    connectDb()
})




