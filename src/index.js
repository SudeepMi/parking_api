import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import connectToDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import spotsRoutes from "./routes/parkingSpotRoutes.js";
import vehiclesRoutes from "./routes/vehicleRoutes.js";
import reservationsRoutes from "./routes/reservationsRoute.js";

import parkingRoutes from "./routes/parkingRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: [process.env.UI_ORIGIN, process.env.ADMIN_ORIGIN],
  
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/spots", spotsRoutes);
app.use("/payments", paymentRoutes);
app.use("/parkings", parkingRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/reservations", reservationsRoutes);

async function startServer() {
  try {
    await connectToDB();
    const PORT = process.env.PORT;
    app.use("/",(req,res) => {
      res.status(200).json({msg:"Hello from parking api server"})
    })
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

startServer();
