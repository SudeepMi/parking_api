import express from "express";
import {
  getParking,
  exitParking,
  getParkings,
  enterParking,
  deleteParking,
  getTotal,
  validatePaymentAndExit,
  getParkingByUser,
} from "../controllers/parkingController.js";

import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/u/p", authenticate, getParkingByUser);
router.put("/:id", authenticate, exitParking);

router.use(authenticate, authorize);

router.post("/", enterParking);
router.get("/", getParkings);
router.get("/total", getTotal);
router.get("/:id", getParking);

router.delete("/:id", deleteParking);
router.put("/:id/validate", validatePaymentAndExit);

export default router;
