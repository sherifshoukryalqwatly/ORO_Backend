import express from "express";
import * as reviewController from "../controllers/review.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validations/review.validation.js";

const router = express.Router();

// PUBLIC
router.get(
  "/product/:productId",
  reviewController.findByProduct
);

router.get("/:id", reviewController.findById);

router.use(isAuthenticated);

// USER
router.post(
  "/",
  validationMiddleware(createReviewSchema),
  reviewController.create
);

router.patch(
  "/:id",
  validationMiddleware(updateReviewSchema),
  reviewController.update
);

router.delete("/:id", reviewController.remove);

// ADMIN
router.get(
  "/",
  authorizeRole("admin"),
  reviewController.findAll
);

export default router;
