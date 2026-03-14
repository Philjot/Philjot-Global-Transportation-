import mongoose, {Schema} from "mongoose";

const BookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, enum: ['seminar', 'excursion', 'other'], required: true },
    passengers: { type: Number, required: true },
    tripDate: { type: Date, required: true },
    destination: { type: String, required: true },
    status: { type: String, default: 'pending' }, // pending, confirmed, completed
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;

