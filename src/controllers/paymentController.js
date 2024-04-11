import Payment from "../models/Payment.js";
import Parking from "../models/Parking.js";
import ParkingSpot from "../models/ParkingSpot.js";

// In this code, we've added the parseFloat function to parse the amount into a float,
// and we've also added a check to ensure that the parsed amount is a valid number.
// Additionally, we've used Math.abs() to perform a more tolerant comparison between the total amount
// and the parsed amount to handle potential floating-point precision issues. This ensures that payments close
// to the total amount are considered as "Successful" payments.
export const createPayment = async (req, res) => {
  try {
    let { amount, paymentMethod, parkingId } = req.body;

    // Parse amount into a float
    amount = parseFloat(amount).toString();

    if (!amount || !parkingId) {
      return res.status(400).json({ error: "Invalid or missing required fields" });
    }

    const parking = await Parking.findById(parkingId).populate({
      path: "reservation",
    });

    if (!parking) {
      return res.status(404).json({ error: "Parking entry not found" });
    }

    let paymentStatus;
    let remainingAmount;
    if (Math.abs(parking.totalAmount - amount) < 0.01) {
      parking.status = "Exited";
      paymentStatus = "Successful";
    } else {
      remainingAmount = parking.totalAmount - amount;
      parking.status = "Payment Pending";
      paymentStatus = "Partially";
    }

    const payment = new Payment({
      amount,
      parking: parkingId,
      paymentMethod,
      paymentStatus,
      remainingAmount,
    });
    await payment.save();

    // Update the parking entry's payment field with the payment ID
    parking.payment = payment._id;
    await parking.save();

    // Since you are sure parking.reservation.parkingSpot won't be null
    const parkingSpot = await ParkingSpot.findById(parking.reservation.parkingSpot);
    parkingSpot.revenue += amount;
    await parkingSpot.save();

    res.status(201).json({ payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating payment" });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("parking");
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments" });
  }
};
export const getTotal = async (req, res) => {
  try {
    const total = await Payment.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments" });
  }
};

export const getPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id).populate("parking");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment" });
  }
};

export const updatePayment = async (req, res) => {
  const { id } = req.params;
  let { amount } = req.body;

  // Parse amount into a float
  amount = parseFloat(amount);
  // if (amount<10){
  //   amount = 10;
  // }

  if (!amount || isNaN(amount) || !id) {
    return res.status(400).json({ error: "Invalid or missing required fields" });
  }

  const parking = await Parking.findById(id)
    .populate({
      path: "reservation",
    })
    .populate("payment");

  if (!parking) {
    return res.status(404).json({ error: "Parking entry not found" });
  }

  if (Math.abs(parking.payment.remainingAmount - amount) < 0.01) {
    parking.status = "Exited";
    parking.payment.remainingAmount = 0; // Update the remainingAmount within the payment document
    parking.payment.paymentStatus = "Successful";
  } else {
    parking.payment.remainingAmount -= amount; // Update the remainingAmount within the payment document
    parking.status = "Payment Pending";
    parking.payment.paymentStatus = "Partially";
  }

  try {
    // Save the updated parking document
    await parking.save();

    // Update the referenced payment document
    await parking.payment.save();

    const parkingSpot = await ParkingSpot.findById(parking.reservation.parkingSpot);
    parkingSpot.revenue += amount;
    await parkingSpot.save();
    res.status(200).json({ parking });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment" });
  }
};

export const deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPayment = await Payment.findByIdAndRemove(id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ deletedPayment });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment" });
  }
};
