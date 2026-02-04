import express from "express";
import authRoutes from "../auth/auth.route.js";

const router = express.Router();

router.use("/auth", authRoutes);

// Default route for API health check
router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;