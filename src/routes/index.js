import express from "express";

const router = express.Router();

// Default route for API health check
router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;