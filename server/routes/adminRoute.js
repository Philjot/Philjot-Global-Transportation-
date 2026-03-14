import { Router } from "express";
import { deleteBooking, getAllBookings } from '../controllers/adminController.js';


const adminRoute = Router();


adminRoute.get('/bookings', getAllBookings);
adminRoute.delete('/bookings/:id', deleteBooking);


export default adminRoute;


