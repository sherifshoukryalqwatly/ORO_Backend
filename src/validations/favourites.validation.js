import Joi from 'joi';
import mongoose from 'mongoose';

// Helper to validate Mongo ObjectId
const objectId = () => Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

// ------------------- CREATE / GET -------------------
export const createFavouriteSchema = Joi.object({
  user: objectId().required().messages({
    'any.required': 'User Id is required / الرقم المميز للمستخدم مطلوب',
    'any.invalid': 'Invalid User Id / Id المستخدم خطأ'
  }),
});

// ------------------- UPDATE -------------------
export const updateFavouriteSchema = Joi.object({
  products: Joi.array()
    .items(objectId().messages({
      'any.invalid': 'Invalid Product Id / Id المنتج خطأ'
    }))
    .required()
    .messages({
      'any.required': 'Products array is required / مصفوفة المنتجات مطلوبة'
    })
});

// ------------------- ID PARAM -------------------
export const favouriteIdSchema = Joi.object({
  id: objectId().required().messages({
    'any.required': 'Favourite Id is required / Id المفضل مطلوب',
    'any.invalid': 'Invalid Favourite Id / Id المفضل خطأ'
  })
});

// ------------------- BULK DELETE -------------------
export const deleteFavouritesSchema = Joi.object({
  ids: Joi.array()
    .items(objectId().messages({
      'any.invalid': 'Invalid Favourite Id / Id المفضل خطأ'
    }))
    .min(1)
    .required()
    .messages({
      'any.required': 'IDs array is required / مصفوفة Ids مطلوبة',
      'array.min': 'At least one ID must be provided / يجب توفير Id واحد على الأقل'
    })
});
