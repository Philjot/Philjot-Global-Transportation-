import jwt from 'jsonwebtoken';



export const adminLogin = (req, res) => {
    const { password } = req.body;

    // Check if the password matches your .env file
    if (password === process.env.ADMIN_PASSWORD) {
        // Create a VIP Token that lasts for 24 hours
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        return res.json({ success: true, token });
    }

    res.status(401).json({ success: false, message: "Invalid Password" });
};