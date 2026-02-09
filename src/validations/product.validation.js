import Joi from "joi";

const localizedString = (min, max, required = true) =>
  Joi.object({
    ar: Joi.string().min(min).max(max).required(),
    en: Joi.string().min(min).max(max).required(),
  }).required(required);

export const createProductSchema = Joi.object({
  title: localizedString(2, 50),
  description: localizedString(5, 500),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100),
  stock: Joi.number().min(0),
  material: Joi.string().allow(null, ""),
  category: Joi.string().hex().length(24).required(),
  brand: Joi.string().required(),
  images: Joi.array()
    .items(
      Joi.object({
        public_id: Joi.string().required(),
        secure_url: Joi.string().uri().required(),
      })
    )
    .min(1)
    .required(),
  isActive: Joi.boolean(),
});

export const updateProductSchema = createProductSchema.min(1);
