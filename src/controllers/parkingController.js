import Parking from "../models/Parking.js";
import Payment from "../models/Payment.js";
import Reservation from "../models/Reservation.js";
import { getDistance } from "geolib";

export const enterParking = async (req, res) => {
  const admin = req.user.userId;
  const reservation = req.body.reservation;

  try {
    const parking = new Parking({
      reservation,
      admin,
    });

    await parking.save();

    res
      .status(201)
      .json({ message: "Parking entry created successfully", parking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const exitParking = async (req, res) => {
  try {
    const { id } = req.params;
    const parking = await Parking.findById(id);

    if (!parking) {
      return res.status(404).json({ message: "Parking entry not found" });
    }

    if (parking.status === "Exited") {
      return res
        .status(400)
        .json({ message: "Parking already marked as exited" });
    }

    parking.exitedTime = Date.now();
    parking.status = "Payment Pending";

    // parking.duration is calculated as the difference between parking.exitedTime and parking.enteredTime in milliseconds.
    // To convert this to minutes, you're dividing by (1000 * 60). This calculation results in the duration of the parking session in minutes.
    parking.duration = Math.floor(
      (parking.exitedTime - parking.enteredTime) / (1000 * 60)
    );

    const reservation = await Reservation.findById(
      parking.reservation
    ).populate("parkingSpot");

    // Calculate the parking.totalAmount by multiplying the duration in minutes by the parking spot's hourly rate (pricePerHour).
    // This calculation gives you the total cost of parking for that duration.
    parking.totalAmount =
      (parking.duration / 60) * reservation.parkingSpot.pricePerHour;

    // Limit the totalAmount to two decimal places using toFixed()
    parking.totalAmount = parseFloat(parking.totalAmount.toFixed(2));

    await parking.save();
    res.status(200).json({
      message: "Parking updated successfully. Payment is pending.",
      parking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const validatePaymentAndExit = async (req, res) => {
  const { id } = req.params;

  try {
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: "Parking entry not found" });
    }

    const payment = await Payment.findOne({ parking: id });
    if (!payment || payment.paymentStatus !== "Successful") {
      return res.status(400).json({ message: "Payment not verified" });
    }

    parking.status = "Exited";
    await parking.save();
    res.status(200).json({ message: "Vehicle is allowed to exit" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getParkings = async (req, res) => {
  try {
    const parkings = await Parking.find().populate("payment");

    res.status(200).json({ parkings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getTotal = async (req, res) => {
  try {
    const total = await Parking.countDocuments();

    res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getParking = async (req, res) => {
  try {
    const { id } = req.params;

    const parking = await Parking.findById(id)
      .populate({
        path: "reservation",
      })
      .populate("payment");

    if (!parking) {
      return res.status(404).json({ message: "Parking entry not found" });
    }

    res.status(200).json({ parking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getParkingByUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const parking = await Parking.find({})
      .populate({
        path: "reservation",
      })
      .populate("payment");

    const filteredParking = parking.filter(
      (entry) => entry.reservation.customer.toString() === userId
    );
    if (filteredParking.length === 0) {
      return res.status(404).json({ message: "Parking entry not found" });
    }

    res.status(200).json({ parking: parking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteParking = async (req, res) => {
  try {
    const { id } = req.params;

    const parking = await Parking.findByIdAndDelete(id);
    if (!parking) {
      return res.status(404).json({ message: "Parking entry not found" });
    }
    res.status(200).json({ message: "Parking entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getknn = async (req, res) => {
  try {
    const location_points = [
      { coords: [27.6853, 85.3317], label: "Sankhamul" },
      { coords: [27.6771, 85.3171], label: "Labim Mall" },
      { coords: [27.7183, 85.35], label: "KL Tower" },
      { coords: [27.7097, 85.3191], label: "Rising Mall" },
      { coords: [27.7105, 85.3179], label: "Sherpa Mall" },
    ];

    // Function to find k-nearest neighbors
    function kNearestNeighbors(k, newData) {
      // Calculate distances from newData to all points in trainingData
      const distances = location_points.map(({ coords, label }) => ({
        label,
        distance: getDistance(newData.coords, coords),
      }));

      // Sort distances in ascending order
      distances.sort((a, b) => a.distance - b.distance);

      // Get k-nearest neighbors
      const nearestNeighbors = distances.slice(0, k);

      // Count occurrences of each label
      const labelCounts = nearestNeighbors.reduce((counts, { label }) => {
        counts[label] = (counts[label] || 0) + 1;
        return counts;
      }, {});

      // Find the majority label
      let majorityLabel = null;
      let maxCount = 0;
      for (const label in labelCounts) {
        if (labelCounts[label] > maxCount) {
          majorityLabel = label;
          maxCount = labelCounts[label];
        }
      }

      return nearestNeighbors;
    }

    // Example usage
    const newData = { coords: [27.6992, 85.3126], label: "Civil Mall" };
    const k = 3;
    const predictedLabel = kNearestNeighbors(k, newData);
    console.log("Predicted label:", predictedLabel);

    res.status(200).json({ predictedLabel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
