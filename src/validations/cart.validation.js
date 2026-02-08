import Joi from 'joi';
import mongoose from 'mongoose';

/* ----------------------------- HELPERS ----------------------------- */
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid MongoDB ObjectId');
  }
  return value;
}, 'ObjectId Validation');

/* ----------------------------- ADD ITEM ----------------------------- */
export const addItemSchema = {
  body: Joi.object({
    product: objectId.required(),

    productNameAtAddition: Joi.string().trim(),

    quantity: Joi.number().integer().min(1).required(),

    priceAtAddition: Joi.number().min(0).required()
  })
};

/* ----------------------------- UPDATE ITEM ----------------------------- */
export const updateItemSchema = {
  params: Joi.object({
    productId: objectId.required()
  }),

  body: Joi.object({
    quantity: Joi.number().integer().min(1).required()
  })
};

/* ----------------------------- REMOVE ITEM ----------------------------- */
export const removeItemSchema = {
  params: Joi.object({
    productId: objectId.required()
  })
};

/* ----------------------------- CART ID (ADMIN) ----------------------------- */
export const cartIdSchema = {
  params: Joi.object({
    id: objectId.required()
  })
};

/* ----------------------------- DELETE MANY (ADMIN) ----------------------------- */
export const deleteCartsSchema = {
  body: Joi.object({
    ids: Joi.array().items(objectId).min(1).required()
  })
};
