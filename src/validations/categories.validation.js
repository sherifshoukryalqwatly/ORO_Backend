import Joi from 'joi';
import mongoose from 'mongoose';

/* ----------------------------- HELPER ----------------------------- */
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid MongoDB ObjectId');
  }
  return value;
}, 'ObjectId Validation');

/* ----------------------------- LOCALIZED STRING ----------------------------- */
const localizedString = (min = 2, max = 50, required = true) =>
  Joi.object({
    en: required ? Joi.string().trim().min(min).max(max).required() : Joi.string().trim().min(min).max(max).allow(''),
    ar: required ? Joi.string().trim().min(min).max(max).required() : Joi.string().trim().min(min).max(max).allow('')
  });

/* ----------------------------- CREATE CATEGORY ----------------------------- */
export const createCategorySchema = {
  body: Joi.object({
    name: localizedString(2, 50).required(),
    image: Joi.object({
      public_id: Joi.string().required(),
      secure_url: Joi.string().required()
    }).required(),
    parent: objectId.allow(null),
    isActive: Joi.boolean()
  })
};

/* ----------------------------- UPDATE CATEGORY ----------------------------- */
export const updateCategorySchema = {
  params: Joi.object({
    id: objectId.required()
  }),
  body: Joi.object({
    name: localizedString(2, 50, false),
    image: Joi.object({
      public_id: Joi.string(),
      secure_url: Joi.string()
    }),
    parent: objectId.allow(null),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean()
  })
};

/* ----------------------------- CATEGORY ID ----------------------------- */
export const categoryIdSchema = {
  params: Joi.object({
    id: objectId.required()
  })
};

/* ----------------------------- DELETE MANY ----------------------------- */
export const deleteCategoriesSchema = {
  body: Joi.object({
    ids: Joi.array().items(objectId).min(1).required()
  })
};

/* ----------------------------- FIND BY SLUG ----------------------------- */
export const findBySlugSchema = {
  params: Joi.object({
    slug: Joi.string().trim().required()
  }),
  query: Joi.object({
    lang: Joi.string().valid('en', 'ar').optional()
  })
};
