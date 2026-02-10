import Joi from 'joi';
import mongoose from 'mongoose';

/* ----------------------------- Helpers ----------------------------- */
export const objectId = Joi.string()
  .custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid'); 
    }
    return value;
  })
  .messages({
    'any.invalid': 'Invalid MongoDB ObjectId'
  });

const localizedString = (min = 2, max = 500, required = true) =>
  Joi.object({
    ar: Joi.string().trim().min(min).max(max).required(),
    en: Joi.string().trim().min(min).max(max).required()
  }).required();

/* ----------------------------- CREATE ----------------------------- */
export const createBannerSchema = {
  body: Joi.object({
    'title.en': Joi.string().trim().min(2).required(),
    'title.ar': Joi.string().trim().min(2).required(),

    'subtitle.en': Joi.string().trim().allow(''),
    'subtitle.ar': Joi.string().trim().allow(''),

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
  }).optional()
};

/* ----------------------------- DELETE MANY ----------------------------- */
export const deleteBannerSchema = {
  body: Joi.object({
    ids: Joi.array()
      .items(objectId) 
      .min(1)
      .required()
  })
};

/* ----------------------------- FIND BY ID ----------------------------- */
export const bannerIdSchema = {
  params: Joi.object({
    id: objectId.required()
  })
};
