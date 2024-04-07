import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    spot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSpot",
      required: true,
    },
    name: {
      type: String,
    },
    email:{
        type:String,
    },
    message:{
        type:String,
    }
    
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
