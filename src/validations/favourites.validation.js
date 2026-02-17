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
   ADD / REMOVE PRODUCT (PARAMS VALIDATION)
========================================================= */
export const productParamSchema = Joi.object({
  productId: objectId().required().messages({
    'any.required': 'Product Id is required / Id المنتج مطلوب',
    'any.invalid': 'Invalid Product Id / Id المنتج خطأ'
  })
});


/* =========================================================
   GET MY FAVOURITES
   (No body required — user from token)
========================================================= */
export const emptySchema = Joi.object({}); 
