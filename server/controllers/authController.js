const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("Received request body:", req.body); // Log request body
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userRole = role === "admin" ? "admin" : "user";

        const user = await User.create({ name, email, password: hashedPassword, role: userRole });

        res.status(201).json({ message: "User registered successfully", user});
    } catch (error) {
        console.error("Registration error:", error.message); // Log the exact error
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token, role: user.role , id: user._id});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login
};