import mongoose from "mongoose";

import ParkingSpot from "../models/ParkingSpot.js";
import Feedback from "../models/Feedback.js";

export const createParkingSpot = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { name, description, location, spotType, pricePerHour, capacity, features, imageUrls, coordinates } = req.body;

    if (!name || !location || !spotType || !pricePerHour || !capacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parkingSpot = new ParkingSpot({
      name,
      description,
      location,
      spotType,
      pricePerHour,
      capacity,
      features,
      imageUrls,
      owner: ownerId,
      coordinates
    });

    await parkingSpot.save();
    res.status(201).json({ message: "Parking spot created successfully", data: parkingSpot });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating parking spot", error: error.message });
  }
};

export const getParkingSpots = async (req, res) => {
  try {
    const spots = await ParkingSpot.find();
    res.status(200).json({ spots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching parking spots", error: error.message });
  }
};
export const getTotalSpots = async (req, res) => {
  try {
    const total = await ParkingSpot.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching total parking spot", error: error.message });
  }
};


export const NearestParking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid parkingSpot ID" });
    }

    const spot = await ParkingSpot.findById(id);
    if (!spot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    res.status(200).json({ spot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching parking spot", error: error.message });
  }
};


export const getParkingSpot = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid parkingSpot ID" });
    }

    const spot = await ParkingSpot.findById(id);
    if (!spot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    res.status(200).json({ spot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching parking spot", error: error.message });
  }
};

export const updateParkingSpot = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid parkingSpot ID" });
    }

    const spot = await ParkingSpot.findById(id);
    if (!spot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    const updateFields = ["name", "available", "description", "location", "pricePerHour", "features", "imageUrls"];

    for (const field of updateFields) {
      if (req.body[field] !== undefined) {
        spot[field] = req.body[field];
      }
    }

    // Handle capacity separately since it's an object
    if (req.body.capacity) {
      if (req.body.capacity.car !== undefined) {
        spot.capacity.car = req.body.capacity.car;
      }
      if (req.body.capacity.bike !== undefined) {
        spot.capacity.bike = req.body.capacity.bike;
      }
    }

    await spot.save();
    res.status(200).json({ message: "Parking spot updated successfully", spot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating parking spot", error: error.message });
  }
};

export const updateAvaliability = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid parkingSpot ID" });
    }

    const spot = await ParkingSpot.findById(id);
    if (!spot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    spot.available = !spot.available;

    await spot.save();
    res.status(200).json({ message: "Parking spot updated successfully", spot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating parking spot", error: error.message });
  }
};

export const deleteParkingSpot = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid parkingSpot ID" });
    }

    const spot = await ParkingSpot.findByIdAndDelete(id);
    if (!spot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    res.status(200).json({ message: "Parking spot deleted successfully", spot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting parking spot", error: error.message });
  }
};


export const handleFeedback = async (req,res)=> {

  try {
    const _feedback = await Feedback.create(req.body)
    if(_feedback){
      res.json(_feedback);
    }else{
      res.status(500).json("error while creating feedback")
    }
    
  } catch (error) {
    console.log(error)
  }
}
