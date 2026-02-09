import Joi from "joi";

export const createRefundSchema = Joi.object({
  order: Joi.string().hex().length(24).required(),
  payment: Joi.string().hex().length(24).required(),
  amount: Joi.number().min(1).required(),
  reason: Joi.string().min(5).max(500).required(),
});

export const updateRefundSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "approved", "rejected", "completed"),
  notes: Joi.string().allow("", null),
}).min(1);
