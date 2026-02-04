import express from "express";
import auditlogRoute from "./auditlog.route.js";
import authRoutes from "../auth/auth.route.js";
import userRoutes from "./user.route.js";

const router = express.Router();

router.use("/auditlog", auditlogRoute);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

// Default route for API health check
router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;