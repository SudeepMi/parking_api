import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    
  },
  paymentStatus: {
    type: String,
    enum: ["Successful", "Partially", "Pending", "Failed"],
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "Online",
  },
  remainingAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  parking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parking",
    required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
