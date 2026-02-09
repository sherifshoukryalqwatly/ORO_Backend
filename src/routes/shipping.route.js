import express from "express";
import * as shippingController from "../controllers/shipping.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  createShippingSchema,
  updateShippingSchema,
} from "../validations/shipping.validation.js";

const router = express.Router();

router.use(isAuthenticated);

// USER / ADMIN
router.get("/order/:orderId", shippingController.findByOrder);
router.get("/:id", shippingController.findById);

// ADMIN
router.get("/", authorizeRole("admin"), shippingController.findAll);

router.post(
  "/",
  authorizeRole("admin"),
  validationMiddleware(createShippingSchema),
  shippingController.create
);

router.patch(
  "/:id",
  authorizeRole("admin"),
  validationMiddleware(updateShippingSchema),
  shippingController.update
);

router.delete(
  "/:id",
  authorizeRole("admin"),
  shippingController.remove
);

export default router;
