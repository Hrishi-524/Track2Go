import jwt from 'jsonwebtoken'
import redisClient from '../config/redisClient.js';

const isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token expired, you are alredy logged out" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        /** 
         *  All routes protected by isLoggedIn middleware have this attached to their req object
         *  req.user = {
         *      id,
         *      username, 
         *      email
         *  }
         */
        req.user = decoded; 
        next();
    } catch(err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

export default isLoggedIn