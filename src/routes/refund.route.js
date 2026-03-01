import express from "express";
import * as refundController from "../controllers/refund.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  createRefundSchema,
  updateRefundSchema,
} from "../validations/refund.validation.js";

const router = express.Router();

router.use(isAuthenticated);

// USER
router.post(
  "/",
  validationMiddleware(createRefundSchema),
  refundController.create
);

router.get("/:id", refundController.findById);

// ADMIN
router.get("/", authorizeRole("admin"), refundController.findAll);

router.patch(
  "/:id",
  authorizeRole("admin"),
  validationMiddleware(updateRefundSchema),
  refundController.updateStatus
);

router.delete(
  "/:id",
  authorizeRole("admin"),
  refundController.remove
);

router.delete(
  "/hard/:id",
  authorizeRole("admin"),
  refundController.hRemove
);

export default router;
