import { Router } from "express";
import { bookNow } from "../controllers/BookingController.js";

const BookingRouter = Router();

BookingRouter.post('/', bookNow)

export default BookingRouter;
