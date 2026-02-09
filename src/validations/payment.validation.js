import Joi from "joi";

export const createPaymentSchema = Joi.object({
  order: Joi.string().hex().length(24).required(),
  paymentMethod: Joi.string().valid("COD", "STRIPE", "PAYPAL").required(),
  transactionId: Joi.string().allow(null, ""),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().length(3).default("EGP"),
});

export const updatePaymentSchema = Joi.object({
  status: Joi.string().valid("pending", "completed", "failed", "refunded"),
  transactionId: Joi.string().allow(null, ""),
});
