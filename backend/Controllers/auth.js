import User from "../Models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ COOKIE SET
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.environment === "production" ? true : false,      // true in production (https)
            sameSite: process.env.environment === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.environment === "production" ? true : false,      // true in production (https)
        sameSite: process.env.environment === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
};

// // Get current authenticated user
// export const me = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
