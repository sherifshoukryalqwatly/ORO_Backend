import express from "express";
import * as couponController from '../controllers/coupon.controller.js';
import validationMiddleware from "../middlewares/validation.middleware.js";
import { createCouponSchema, updateCouponSchema, couponIdSchema, couponCodeSchema, deleteCouponsSchema } from '../validations/coupon.validation.js';
import { authorizeRole, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔹 جميع المسارات تحتاج توثيق الدخول
router.use(isAuthenticated);

// ------------------- GET BY CODE -------------------
router.route('/by_code/:code')
  .get(
    authorizeRole('admin'),
    validationMiddleware(couponCodeSchema, 'params'),
    couponController.findByCode
  );

// ------------------- GET BY ID -------------------
router.route('/:id')
  .get(
    authorizeRole('admin'),
    validationMiddleware(couponIdSchema, 'params'),
    couponController.findById
  )
  .patch(
    authorizeRole('admin'),
    validationMiddleware(couponIdSchema, 'params'),
    validationMiddleware(updateCouponSchema),
    couponController.update
  )
  .delete(
    authorizeRole('admin'),
    validationMiddleware(couponIdSchema, 'params'),
    couponController.remove
  );

// ------------------- CREATE -------------------
router.route('/')
  .post(
    authorizeRole('admin'),
    validationMiddleware(createCouponSchema),
    couponController.create
  );

// ------------------- BULK DELETE -------------------
router.route('/delete_all')
  .delete(
    authorizeRole('admin'),
    validationMiddleware(deleteCouponsSchema),
    couponController.removeAll
  );

// ------------------- HARD DELETE -------------------
router.route('/hdelete/:id')
  .delete(
    authorizeRole('admin'),
    validationMiddleware(couponIdSchema, 'params'),
    couponController.hRemove
  );

// ------------------- HARD BULK DELETE -------------------
router.route('/hdelete_all')
  .delete(
    authorizeRole('admin'),
    validationMiddleware(deleteCouponsSchema),
    couponController.hRemoveAll
  );

// ------------------- GET ALL -------------------
router.route('/')
  .get(authorizeRole('admin'), couponController.findAll);

export default router;
