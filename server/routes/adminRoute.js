import { Router } from "express";
import { deleteBooking, getAllBookings } from "../Controllers/adminController.js";
import { protectAdmin } from "../middleware/middleware.js";
import { adminLogin } from "../controllers/authController.js";


const adminRoute = Router();

// Public Route (To get the token)
adminRoute.post('/login', adminLogin);


adminRoute.get('/bookings', protectAdmin, getAllBookings);
adminRoute.delete('/bookings/:id', protectAdmin, deleteBooking);



export default adminRoute;


