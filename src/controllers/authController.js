import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// Helper function for generating access tokens
const generateAccessToken = (userId, roles) => {
  return jwt.sign({ userId, roles }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

// Helper function for generating refresh tokens
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, coordinates } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, coordinates });

    // Omit the password field from the response JSON
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    return res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error creating a new user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user exists with this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credentials don't match" });
    }

    const accessToken = generateAccessToken(user._id, user.roles);
    const refreshToken = generateRefreshToken(user._id);

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user exists with this email" });
    }
    if (!user.roles.includes("admin")) {
      return res.status(401).json({ message: "You are not assigned as admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credentials don't match" });
    }

    const accessToken = generateAccessToken(user._id, user.roles);
    const refreshToken = generateRefreshToken(user._id);

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const foundUser = await User.findById(decoded.userId);
    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = generateAccessToken(foundUser._id, foundUser.roles);

    res.json({ accessToken });
  });
};

export const profile = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId)
    .select("name")
    .populate({ path: "vehicles" })
    .select("model licensePlate vehicleType")
    .populate({
      path: "reservations",
      populate: [
        {
          path: "parkingSpot",
        },
        {
          path: "vehicle",
        },
      ],
    });
  return res.json({ user });
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
