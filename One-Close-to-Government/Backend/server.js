import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import reportRoutes from "./routes/reportRoutes.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Clerk middleware globally adds req.auth
app.use(clerkMiddleware());

// Routes
app.use("/api/reports", reportRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);  