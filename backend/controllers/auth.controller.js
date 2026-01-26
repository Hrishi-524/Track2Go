import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import redisClient from '../config/redisClient.js'
import jwt from 'jsonwebtoken'
import { signUpSchema, loginSchema, passwordResetSchema } from '../validations/auth.validation.js'

export const signUpUser = async (req, res) => {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
        console.log(parsed.error.issues[0].message)
        return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
    }

    const { username, email, password } = parsed.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
        username: username,
        email: email,
        password: hash,
    });

    const token = jwt.sign({ 
        id: newUser._id, 
        username: newUser.username, 
        email: newUser.email 
    }, process.env.JWT_SECRET,{ 
        expiresIn: '7h' 
    });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 60 * 60 * 1000 // 7 hours
    });

    await newUser.save();
    console.log(`SIGNUP USER SUCCESS : { id: ${newUser._id}, username: ${newUser.username}, email: ${newUser.email} }`)
    return res.status(200).json({ success: true, message: "User signed up", data: { user: { id: newUser._id, username: newUser.username, email: newUser.email }}});

}

export const loginUser = async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(401).json({ success: false, message: parsed.error.issues[0].message });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email })
    if(!user) {
        console.log('User does not exist - Email is incorrect');
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(isPasswordCorrect) {
        const token = jwt.sign({ 
            id: user._id, 
            username: user.username, 
            email: user.email 
        }, process.env.JWT_SECRET,{ 
            expiresIn: '7h' 
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 60 * 60 * 1000 // 7 hours
        });

        return res.status(200).json({success: true, message: "User logged in", data: { user: { id: user._id, username: user.username, email: user.email }}});
    } else {
        console.log('Password is incorrect');
        return res.status(200).json({ success: false, message: 'Invalid email or password' });
    }
}

export const logoutUser = async (req, res) => {
    try {
        let token = null;

        // 1️⃣ Cookie-based (frontend)
        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        // 2️⃣ Bearer-based (CLI support)
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(400).json({ message: "Token missing" });
        }

        const decoded = jwt.decode(token);
        if (!decoded?.exp) {
            return res.status(400).json({ message: "Invalid token format" });
        }

        const ttl = decoded.exp - Math.floor(Date.now() / 1000);

        if (ttl > 0) {
            await redisClient.set(token, "blacklisted", { ex: ttl });
        }

        // 🔑 Clear cookie
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logged out"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Logout failed" });
    }
};


export const passwordReset = async (req, res) => {
    const parsed = passwordResetSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, newPassword } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
};

export const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
};
