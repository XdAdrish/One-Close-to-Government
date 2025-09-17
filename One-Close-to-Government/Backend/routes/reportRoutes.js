import express from "express";
import {
  createReport,
  getUserReports,
  getAllReports,
  updateReportStatus,
} from "../controllers/reportController.js";
import { requireAuth } from "@clerk/express";
import { requireRole } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// User routes (protected)
router.post(
  "/",
  requireAuth(),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "voiceNote", maxCount: 1 },
  ]),
  createReport
);
router.get("/my", requireAuth(), getUserReports);

// Admin routes (protected + role-based)
router.get("/", requireAuth(), requireRole("admin"), getAllReports);
router.put("/:id", requireAuth(), requireRole("admin"), updateReportStatus);

export default router;
