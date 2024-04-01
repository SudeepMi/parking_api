import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enteredTime: {
      type: Date,
      default: Date.now,
    },
    exitedTime: {
      type: Date,
      default: null,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    status: {
      type: String,
      enum: ["Parked", "Exited", "Payment Pending"],
      default: "Parked",
    },
    duration: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Parking = mongoose.model("Parking", parkingSchema);

export default Parking;
