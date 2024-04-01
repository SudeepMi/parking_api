import express from "express";

import { registerUser, loginUser, refresh, logout, profile, loginAdmin } from "../controllers/authController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", loginAdmin);
router.post("/refresh", refresh);
router.get("/me", authenticate, profile);
router.post("/logout", logout);

export default router;
