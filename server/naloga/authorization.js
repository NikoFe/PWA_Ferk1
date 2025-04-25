require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

const users = []; // Store users (Use a DB in production)
const REFRESH_TOKENS = new Set();

const SECRET_KEY = "your_secret_key";
const REFRESH_SECRET = "your_refresh_secret";

// Helper function to generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ username: user.username }, REFRESH_SECRET, { expiresIn: "7d" });
    REFRESH_TOKENS.add(refreshToken);
    return { accessToken, refreshToken };
};

// Register user
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.json({ message: "User registered" });
});

// Login user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken });
});

// Refresh token
app.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken || !REFRESH_TOKENS.has(refreshToken)) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        REFRESH_TOKENS.delete(refreshToken);
        REFRESH_TOKENS.add(newRefreshToken);

        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true });
        res.json({ accessToken });
    });
});

// Protected route
app.get("/protected", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token required" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        res.json({ message: "Sensitive data", user });
    });
});

// Logout
app.post("/logout", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    REFRESH_TOKENS.delete(refreshToken);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
});

// Start server
app.listen(4000, () => console.log("Server running on port 4000"));
