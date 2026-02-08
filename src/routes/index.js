import express from "express";

import auditlogRoutes from "./auditlog.route.js";
import authRoutes from "../auth/auth.route.js";
import userRoutes from "./user.route.js";
import addressRoutes from "./address.route.js";
import bannerRoutes from "./banner.route.js";
import cartRoutes from "./cart.route.js";
import categoriesRoutes from "./categories.route.js";
import couponRoutes from "./coupon.route.js";
import favouritesRoutes from "./favourites.route.js";
import inventoryRoutes from "./inventory.route.js";

const router = express.Router();

/* ----------------------------- API ROUTES ----------------------------- */
router.use("/auditlogs", auditlogRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/addresses", addressRoutes);
router.use("/banners", bannerRoutes);
router.use("/carts", cartRoutes);
router.use("/categories", categoriesRoutes);
router.use("/coupons", couponRoutes);
router.use("/favourites", favouritesRoutes);
router.use("/inventory", inventoryRoutes);

/* ----------------------------- HEALTH CHECK ----------------------------- */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

export default router;
