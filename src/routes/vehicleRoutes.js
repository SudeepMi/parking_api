import express from "express";

import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createVehicle,
  getVehicles,
  getVehicle,
  getTotalVehicles,
  updateVehicle,
  deleteVehicle,
  getUserVehicles,
} from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/", authenticate, createVehicle);

router.get("/", authenticate, getVehicles);
router.get("/total", authenticate, authorize, getTotalVehicles);
router.get("/:id", authenticate, authorize, getVehicle);

router.put("/:id", authenticate, updateVehicle);
router.get("/u/p", authenticate, getUserVehicles);
router.delete("/:id", authenticate, deleteVehicle);

export default router;
