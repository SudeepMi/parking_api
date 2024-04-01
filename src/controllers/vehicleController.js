import mongoose from "mongoose";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";


export const createVehicle = async (req, res) => {
  try {
    const { model, licensePlate, vehicleType } = req.body;
    const ownerId = req.user.userId;

    if (!model || !licensePlate || !vehicleType) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const owner = await User.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ message: "User not found" });
    }

    const vehicle = new Vehicle({
      owner: ownerId,
      model,
      licensePlate,
      vehicleType,
    });

    owner.vehicles.push(vehicle._id);
    await owner.save();
    await vehicle.save();
    res.status(201).json({ message: "Vehicle created successfully", data: vehicle });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating vehicle", error: error.message });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate({ path: "owner", select: "_id name email" });
    res.status(200).json({ data: vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vehicles", error: error.message });
  }
};

// export const getVehiclesByUser = async (req, res) => {
//   const userId = req.user.userId;

//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ message: "Invalid user id" });
//   }

//   try {
//     const vehicle = await Vehicle.find({ owner: userId });
//     res.status(200).json({ vehicle });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching vehicles", error: error.message });
//   }
// };

export const getTotalVehicles = async (req, res) => {
  try {
    const total = await Vehicle.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching  total vehicles", error: error.message });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }
    const vehicle = await Vehicle.findById(id).populate({ path: "owner", select: "_id name email" });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ data: vehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vehicle", error: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { model, licensePlate, vehicleType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.model = model || vehicle.model;
    vehicle.licensePlate = licensePlate || vehicle.licensePlate;
    vehicle.vehicleType = vehicleType || vehicle.vehicleType;

    await vehicle.save();
    res.status(200).json({ message: "Vehicle updated successfully", data: vehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating vehicle", error: error.message });
  }
};

// Delete Vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully", data: deletedVehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting vehicle", error: error.message });
  }
};

export const getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.userId });
    res.status(200).json({ vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting vehicle", error: error.message });
  }
};
