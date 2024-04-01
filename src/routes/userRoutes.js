import express from "express";

import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/adminMiddleware.js";

import { deleteUser, getUser, getUsers, userVehicles, getTotalCustomers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", authenticate, authorize, getUsers);
router.get("/total", authenticate, authorize, getTotalCustomers);
router.get("/:id", authenticate, authorize, getUser);
router.delete("/profile", authenticate, deleteUser);
// router.delete("/vehicles", authenticate, userVehicles);

export default router;
