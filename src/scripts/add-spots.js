import dotenv from "dotenv";
import mongoose from "mongoose";
import * as fs from "fs";

// Use the import assertion to specify JSON data type
import ParkingSpots from "../models/ParkingSpot.js";
const mockSpots = JSON.parse(fs.readFileSync("src/constants/parkingSpots.json"));

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    createSpots();
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

async function createSpots() {
  try {
    await ParkingSpots.insertMany(mockSpots);

    console.log(`Parking Spots inserted successfully`);
  } catch (error) {
    console.log("Error while inserting", error.message);
  } finally {
    mongoose.connection.close();
  }
}
