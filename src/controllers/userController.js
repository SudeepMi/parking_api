import mongoose from "mongoose";

import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

export const getUsers = async (req, res) => {
  try {
    const customers = await User.find({ roles: { $nin: ["admin"] } })
      .select("-password")
      .populate({ path: "reservations" })
      .populate({ path: "vehicles" });

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.json({ customers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getTotalCustomers = async (req, res) => {
  try {
    const total = await User.countDocuments({ roles: { $nin: ["admin", "owner", "customer"] } });

    res.json({ total });
  } catch (error) {
    console.error("Error fetching total users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate([
        {
          path: "vehicles",
        },
        {
          path: "reservations",
          populate: [
            {
              path: "parkingSpot",
            },
            {
              path: "vehicle",
            },
          ],
        },
      ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

export const userVehicles = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log(userId, "userId");
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const vehicles = await Vehicle.find({ ownerId: userId });
    if (!vehicles) {
      return res.status(200).json({ message: "No Vehicles found" });
    }

    res.status(200).json({ vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
