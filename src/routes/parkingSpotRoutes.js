import express from "express";

import authorize from "../middlewares/authorizeMiddleware.js";
import authenticate from "../middlewares/authMiddleware.js";

import {
  createParkingSpot,
  deleteParkingSpot,
  getParkingSpot,
  getTotalSpots,
  getParkingSpots,
  updateParkingSpot,
  updateAvaliability,
} from "../controllers/parkingSpotController.js";

const router = express.Router();

router.post("/", authenticate, authorize, createParkingSpot);

router.get("/", getParkingSpots);
router.get("/:id", getParkingSpot);
router.get("/p/total", getTotalSpots);

router.put("/:id/avaliability", authenticate, authorize, updateAvaliability);

router.put("/:id", authenticate, authorize, updateParkingSpot);
router.delete("/:id", authenticate, authorize, deleteParkingSpot);

export default router;
