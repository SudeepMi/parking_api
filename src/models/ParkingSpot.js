import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    location: String,
    available: {
      type: Boolean,
      default: true,
    },
    spotType: {
      type: String,
      enum: ["Indoor", "Open"],
      default: "Open",
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    coordinates:{
      type: String,
      required: true
    },
    capacity: {
      car: {
        type: Number,
        default: 10,
      },
      bike: {
        type: Number,
        default: 50,
      },
    },
    revenue: {
      type: Number,
      default: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    imageUrls: [String],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    coordinates:[String],
    
    reservations: {
      car: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reservation",
        },
      ],
      bike: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reservation",
        },
      ],
    },
  },
  { timestamps: true }
);

const ParkingSpot = mongoose.model("ParkingSpot", parkingSpotSchema);

export default ParkingSpot;
