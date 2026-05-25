import jwt from "jsonwebtoken";
import redisClient from "../config/redisClient.js";

const isLoggedIn = async (req, res, next) => {
    let token = null;

    // Try cookie first (preferred)
    if (req.cookies?.token) {
        console.log("DEBUG/isLoggedIn.js Token found in cookies");
        token = req.cookies.token;
    }

    // Fallback to Authorization header (optional, for CLI)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        console.log("DEBUG/isLoggedIn.js Token found in Authorization header");
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        console.log("DEBUG/isLoggedIn.js No token provided in request");
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const isBlacklisted = await redisClient.get(token);

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token expired or logged out",
            });
        }
    } catch (err) {
        console.error("Redis failure:", err.message);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: "Invalid token",
        });
    }
};

export default isLoggedIn;
