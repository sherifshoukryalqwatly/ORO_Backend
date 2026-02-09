import express from "express";
import * as orderController from "../controllers/order.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  createOrderSchema,
  updateOrderSchema,
  deleteOrdersSchema,
  getOrderByIdSchema
} from "../validations/order.validation.js";

const router = express.Router();

router.use(isAuthenticated); // كل العمليات تحتاج تسجيل دخول

/* -------------------- CREATE ORDER -------------------- */
router.post(
  "/",
  validationMiddleware(createOrderSchema),
  orderController.create
);

/* -------------------- GET ALL ORDERS -------------------- */
router.get(
  "/",
  authorizeRole("admin"),
  orderController.findAll
);

/* -------------------- GET ORDER BY ID -------------------- */
router.get(
  "/:id",
  validationMiddleware(getOrderByIdSchema),
  orderController.findById
);

/* -------------------- UPDATE ORDER -------------------- */
router.patch(
  "/:id",
  authorizeRole("admin"),
  validationMiddleware(updateOrderSchema),
  orderController.update
);

/* -------------------- DELETE ORDER (SOFT) -------------------- */
router.delete(
  "/:id",
  authorizeRole("admin"),
  validationMiddleware(getOrderByIdSchema),
  orderController.remove
);

/* -------------------- DELETE MULTIPLE ORDERS -------------------- */
router.delete(
  "/",
  authorizeRole("admin"),
  validationMiddleware(deleteOrdersSchema),
  orderController.removeAll
);

/* -------------------- GET ORDERS OF LOGGED-IN USER -------------------- */
router.get("/me", orderController.findByUser);

export default router;
