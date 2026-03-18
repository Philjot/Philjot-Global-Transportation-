import jwt from 'jsonwebtoken';

export const protectAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Token is good, proceed to the route!
    } catch (err) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};