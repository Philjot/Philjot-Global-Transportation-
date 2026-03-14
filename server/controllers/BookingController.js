    import { sendClientEmail } from "../clientMail.js";
    import Booking from "../models/BookingModel.js";
    import { transporter } from "../transporter.js";
    

    export const bookNow = async (req,res) => {
        const { name, email, service, passengers, tripDate, destination } = req.body
        // 2. Email format check (simple regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please provide a valid email address." });
    }
            //Passenger count check
        if (passengers < 1) {
        return res.status(400).json({ message: "At least 1 passenger is required." });
    }
        
    try {
        if(!name || !email || !service || !passengers || !tripDate || !destination)
            return res.status(400).json({message: "All fields are required"});

        // 3. Date Validation: Prevent past dates
        const selectedDate = new Date(tripDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({ message: "You cannot book a date in the past." });
        }

        const newBooking = new Booking({ name, email, service, passengers, tripDate, destination });
        await newBooking.save();

        // Send Notification Email to you (Phil)

        const formattedDate = new Date(tripDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
});
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending to yourself (Phil)
            subject: `🚀 New Booking Request: ${service}`,
            text: `Philjot Global, you have a new request:
            Name: ${name}
            Service: ${service}
            Passengers: ${passengers}
            Destination: ${destination}
            Date: ${formattedDate}
            Please contact the customer at: ${email}`
        };
        
        await transporter.sendMail(mailOptions);
         await sendClientEmail(req.body.email, req.body);

        res.status(201).json({ message: "Booking saved and Phil notified!" });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: "server error. Pls try again later" });
    }
};