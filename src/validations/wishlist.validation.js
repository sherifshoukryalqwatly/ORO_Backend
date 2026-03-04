import Joi from 'joi';
import mongoose from 'mongoose';

/* ------------------- Helper: ObjectId ------------------- */
const objectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId Validation');


/* =========================================================
   PARAMS VALIDATION (productId)
========================================================= */
export const productParamSchema = Joi.object({
  productId: objectId().required().messages({
    'any.required': 'Product Id is required / Id المنتج مطلوب',
    'any.invalid': 'Invalid Product Id / Id المنتج خطأ'
  })
});


/* =========================================================
   ADD TO WISHLIST (BODY VALIDATION)
   variantId is optional
========================================================= */
export const addToWishlistSchema = Joi.object({
  variantId: objectId().optional().allow(null).messages({
    'any.invalid': 'Invalid Variant Id / Id المتغير خطأ'
  })
});


/* =========================================================
   REMOVE FROM WISHLIST (BODY VALIDATION)
========================================================= */
export const removeFromWishlistSchema = Joi.object({
  variantId: objectId().optional().allow(null).messages({
    'any.invalid': 'Invalid Variant Id / Id المتغير خطأ'
  })
});


/* =========================================================
   GET MY WISHLIST
========================================================= */
export const emptySchema = Joi.object({});