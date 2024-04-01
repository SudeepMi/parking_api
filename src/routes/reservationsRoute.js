import express from "express";

import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/adminMiddleware.js";
import {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
  getTotalReservations,
  updateStatus,
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", authenticate, createReservation);
router.get("/", authenticate, getReservations);
router.get("/total", authenticate, authorize, getTotalReservations);
router.get("/:id", authenticate, getReservation);
router.put("/:id", authenticate, updateReservation);
router.put("/:id/status", authenticate, authorize, updateStatus);
router.delete("/:id", authenticate, deleteReservation);

export default router;
