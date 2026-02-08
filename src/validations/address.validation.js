import Joi from 'joi';
import mongoose from 'mongoose';

// ==========================
// Helpers
// ==========================
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// ==========================
// Shared Fields
// ==========================
const locationSchema = Joi.object({
  type: Joi.string().valid('Point').default('Point'),
  coordinates: Joi.array()
    .items(Joi.number())
    .length(2)
    .messages({
      'array.length': 'Coordinates must contain [longitude, latitude]',
    }),
});

// ==========================
// CREATE ADDRESS
// ==========================
export const createAddressSchema = Joi.object({
  user: Joi.string().custom(objectId).required(),

  label: Joi.string().valid('home', 'work', 'other').default('home'),

  country: Joi.string().trim().min(2).required(),
  city: Joi.string().trim().min(2).required(),
  area: Joi.string().trim().allow('', null),
  street: Joi.string().trim().allow('', null),
  building: Joi.string().trim().allow('', null),

  phone: Joi.string()
    .pattern(/^\+?\d{8,15}$/)
    .messages({ 'string.pattern.base': 'Invalid phone number' })
    .allow('', null),

  notes: Joi.string().trim().max(300).allow('', null),

  location: locationSchema.optional(),

  isDefault: Joi.boolean().default(false),
});

// ==========================
// UPDATE ADDRESS
// ==========================
export const updateAddressSchema = Joi.object({
  label: Joi.string().valid('home', 'work', 'other'),

  country: Joi.string().trim().min(2),
  city: Joi.string().trim().min(2),
  area: Joi.string().trim().allow('', null),
  street: Joi.string().trim().allow('', null),
  building: Joi.string().trim().allow('', null),

  phone: Joi.string()
    .pattern(/^\+?\d{8,15}$/)
    .messages({ 'string.pattern.base': 'Invalid phone number' })
    .allow('', null),

  notes: Joi.string().trim().max(300).allow('', null),

  location: locationSchema.optional(),

  isDefault: Joi.boolean(),
}).min(1);

// ==========================
// PARAMS VALIDATION
// ==========================
export const addressIdParamSchema = Joi.object({
  id: Joi.string().custom(objectId).required(),
});

export const addressIdsBodySchema = Joi.object({
  ids: Joi.array()
    .items(Joi.string().custom(objectId))
    .min(1)
    .required(),
});