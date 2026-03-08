import jwt from "jsonwebtoken";
import redisClient from "../config/redisClient.js";

const isLoggedIn = async (req, res, next) => {
  let token = null;

    // Try cookie first (preferred)
    if (req.cookies?.token) {
        token = req.cookies.token;
    }

    // Fallback to Authorization header (optional, for CLI)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        console.log("DEBUG/isLoggedIn.js No token provided in request");
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token expired or logged out" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // { id, username, email }
        /** 
         *  All routes protected by isLoggedIn middleware have this attached to their req object
         *  req.user = {
         *      id,
         *      username, 
         *      email
         *  }
         */
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

export default isLoggedIn;
