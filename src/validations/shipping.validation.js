import Joi from "joi";

export const createShippingSchema = Joi.object({
  order: Joi.string().hex().length(24).required(),
  carrier: Joi.string().min(2).max(100).required(),
  trackingNumber: Joi.string().min(3).max(100).required(),
  estimatedDelivery: Joi.date().optional(),
});

export const updateShippingSchema = Joi.object({
  carrier: Joi.string().min(2).max(100),
  trackingNumber: Joi.string().min(3).max(100),
  status: Joi.string().valid(
    "pending",
    "shipped",
    "in_transit",
    "delivered",
    "cancelled"
  ),
  estimatedDelivery: Joi.date(),
}).min(1);
