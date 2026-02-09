import Joi from "joi";

export const createReviewSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow("", null),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5),
  comment: Joi.string().max(1000).allow("", null),
}).min(1);
