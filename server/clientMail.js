import { transporter } from './transporter.js';



export const sendClientEmail = async (clientEmail, bookingData) => {
    const { name, service, passengers, tripDate, destination } = bookingData;
    
    const mailOptions = {
        from: '"Philjot Global" <yourbusiness@gmail.com>',
        to: clientEmail,
        subject: `Booking Request Received - ${destination}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #001f3f; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">PHILJOT <span style="color: #ff851b;">GLOBAL</span></h1>
                </div>
                <div style="padding: 30px;">
                    <h2>Hello ${name},</h2>
                    <p>We've received your request for <strong>Philjot Global</strong> transportation.</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
                        <p><strong>Service:</strong> ${service.toUpperCase()}</p>
                        <p><strong>Destination:</strong> ${destination}</p>
                        <p><strong>Date:</strong> ${new Date(tripDate).toDateString()}</p>
                        <p><strong>Passengers:</strong> ${passengers}</p>
                    </div>
                    <p>Our team will contact you within 24 hours with a formal quote.</p>
                </div>
            </div>
        `
    };
    return transporter.sendMail(mailOptions);
};

