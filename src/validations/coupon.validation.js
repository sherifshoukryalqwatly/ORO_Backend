import Joi from 'joi';
import mongoose from 'mongoose';

/* ----------------------------- HELPER ----------------------------- */
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

/* ----------------------------- CREATE COUPON ----------------------------- */
export const createCouponSchema = Joi.object({
  code: Joi.string().trim().required(),
  discountType: Joi.string().valid('percentage', 'fixed').required(),
  discountValue: Joi.number().min(1).required(),
  maxDiscountAmount: Joi.number().min(0).optional().allow(null),
  minCartValue: Joi.number().min(0).optional(),
  expiresAt: Joi.date().required(),
  usageLimit: Joi.number().min(1).optional().allow(null),
  usageLimitPerUser: Joi.number().min(1).optional(),
  active: Joi.boolean().optional()
});

/* ----------------------------- UPDATE COUPON ----------------------------- */
export const updateCouponSchema = Joi.object({
  code: Joi.string().trim().optional(),
  discountType: Joi.string().valid('percentage', 'fixed').optional(),
  discountValue: Joi.number().min(1).optional(),
  maxDiscountAmount: Joi.number().min(0).optional().allow(null),
  minCartValue: Joi.number().min(0).optional(),
  expiresAt: Joi.date().optional(),
  usageLimit: Joi.number().min(1).optional().allow(null),
  usageLimitPerUser: Joi.number().min(1).optional(),
  active: Joi.boolean().optional()
});

/* ----------------------------- COUPON ID PARAM ----------------------------- */
export const couponIdSchema = Joi.object({
  id: Joi.string().custom(objectIdValidator, 'ObjectId Validation').required()
});

/* ----------------------------- COUPON CODE PARAM ----------------------------- */
export const couponCodeSchema = Joi.object({
  code: Joi.string().trim().required()
});

/* ----------------------------- BULK DELETE ----------------------------- */
export const deleteCouponsSchema = Joi.object({
  ids: Joi.array().items(
    Joi.string().custom(objectIdValidator, 'ObjectId Validation')
  ).min(1).required()
});
