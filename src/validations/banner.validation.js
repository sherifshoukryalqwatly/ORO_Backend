import Joi from 'joi';
import mongoose from 'mongoose';

/* ----------------------------- Helpers ----------------------------- */
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid MongoDB ObjectId');
  }
  return value;
}, 'ObjectId Validation');

const localizedString = (min = 2, max = 500, required = true) =>
  Joi.object({
    ar: Joi.string().trim().min(min).max(max).required(),
    en: Joi.string().trim().min(min).max(max).required()
  }).required();

/* ----------------------------- CREATE ----------------------------- */
export const createBannerSchema = {
  body: Joi.object({
    title: localizedString(2, 100),

    subtitle: Joi.object({
      ar: Joi.string().trim().min(2).max(200).allow(''),
      en: Joi.string().trim().min(2).max(200).allow('')
    }).optional(),

    image: Joi.object({
      public_id: Joi.string().required(),
      secure_url: Joi.string().uri().required()
    }).required(),

    link: Joi.string().uri().allow(null, ''),

    displayOrder: Joi.number().min(0),

    isActive: Joi.boolean()
  })
};

/* ----------------------------- UPDATE ----------------------------- */
export const updateBannerSchema = {
  params: Joi.object({
    id: objectId.required()
  }),

  body: Joi.object({
    title: Joi.object({
      ar: Joi.string().trim().min(2).max(100),
      en: Joi.string().trim().min(2).max(100)
    }),

    subtitle: Joi.object({
      ar: Joi.string().trim().min(2).max(200).allow(''),
      en: Joi.string().trim().min(2).max(200).allow('')
    }),

    image: Joi.object({
      public_id: Joi.string(),
      secure_url: Joi.string().uri()
    }),

    link: Joi.string().uri().allow(null, ''),

    displayOrder: Joi.number().min(0),

    isActive: Joi.boolean(),

    isDeleted: Joi.boolean()
  }).min(1)
};

/* ----------------------------- DELETE MANY ----------------------------- */
export const deleteBannerSchema = {
  body: Joi.object({
    ids: Joi.array().items(objectId).min(1).required()
  })
};

/* ----------------------------- FIND BY ID ----------------------------- */
export const bannerIdSchema = {
  params: Joi.object({
    id: objectId.required()
  })
};
