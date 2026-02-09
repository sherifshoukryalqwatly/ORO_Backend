import express from "express";
import * as productController from "../controllers/product.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

const router = express.Router();

router.get("/", productController.findAll);
router.get("/:id", productController.findById);

router.use(isAuthenticated);

router.post(
  "/",
  authorizeRole("admin"),
  validationMiddleware(createProductSchema),
  productController.create
);

router.patch(
  "/:id",
  authorizeRole("admin"),
  validationMiddleware(updateProductSchema),
  productController.update
);

router.delete(
  "/:id",
  authorizeRole("admin"),
  productController.remove
);

export default router;
