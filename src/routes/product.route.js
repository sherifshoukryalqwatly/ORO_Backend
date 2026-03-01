import express from "express";
import * as productController from "../controllers/product.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", productController.findAll);
router.get("/:id", productController.findById);

router.use(isAuthenticated);

router.post(
  "/",
  authorizeRole("admin"),
  upload.array('images', 5), // ✅ Multer for multiple images
  validationMiddleware(createProductSchema),
  productController.create
);

router.patch(
  "/:id",
  authorizeRole("admin"),
  upload.array('images', 5), // ✅ Multer for multiple images
  validationMiddleware(updateProductSchema),
  productController.update
);

// ------------------- SOFT DELETE -------------------
router.delete(
    "/:id",
    authorizeRole("admin"),
    productController.remove
);

// ------------------- HARD DELETE -------------------
router.delete(
    "/hard/:id",
    authorizeRole("admin"),
    productController.hRemove
);

// ------------------- BULK SOFT DELETE -------------------
router.delete(
    "/",
    authorizeRole("admin"),
    productController.removeAll
);

// ------------------- BULK HARD DELETE -------------------
router.delete(
    "/hard",
    authorizeRole("admin"),
    productController.hRemoveAll
);

export default router;

