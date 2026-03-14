import Booking from "../models/BookingModel.js";

// Logic to get all bookings
// export const getAllBookings = async (req, res) => {
//     try {
//         const orders
//          = await Order.find().sort({ tripDate: 1 });
//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch bookings" });
//     }
// };



export const getAllBookings = async (req, res) => {
    try {
        console.log("Attempting to fetch orders...");
        const bookings = await Booking.find().sort({ tripDate: 1 });
        console.log("Fetch successful, count:", bookings.length);
        res.json(bookings);
    } catch (error) {
        // This log will show up in your TERMINAL (the black screen)
        console.error("DETAILED DATABASE ERROR:", error.message); 
        res.status(500).json({ 
            error: "Failed to fetch bookings", 
            details: error.message 
        });
    }
};



export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Booking.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error: error.message });
    }
};