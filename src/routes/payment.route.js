import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  createPaymentSchema,
  updatePaymentSchema
} from "../validations/payment.validation.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/me")
  .get(paymentController.findMyPayments);

router.route("/")
  .get(authorizeRole("admin"), paymentController.findAll)
  .post(
    validationMiddleware(createPaymentSchema),
    paymentController.create
  );

router.route("/:id")
  .get(paymentController.findById)
  .patch(
    authorizeRole("admin"),
    validationMiddleware(updatePaymentSchema),
    paymentController.update
  )
  .delete(authorizeRole("admin"), paymentController.remove);

export default router;
