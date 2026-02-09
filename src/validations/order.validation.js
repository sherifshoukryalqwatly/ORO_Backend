import Joi from "joi";
import mongoose from "mongoose";

/* ----------------------------- Order Item Schema ----------------------------- */
const orderItemSchema = Joi.object({
  product: Joi.string().custom(mongoose.Types.ObjectId).required().messages({
    "any.required": "Product ID is required / الرقم المميز للمنتج مطلوب",
    "string.base": "Invalid Product ID format / تنسيق الرقم المميز للمنتج غير صحيح"
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.min": "Quantity must be at least 1 / يجب أن تكون الكمية 1 على الأقل",
    "any.required": "Quantity is required / الكمية مطلوبة"
  }),
  priceAtTime: Joi.number().min(0).required().messages({
    "number.min": "Price must be positive / يجب أن تكون القيمة موجبة",
    "any.required": "Price is required / السعر مطلوب"
  }),
});

/* ----------------------------- Address Schema ----------------------------- */
const addressSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().messages({
    "any.required": "Full name is required / الاسم الكامل مطلوب",
    "string.min": "Full name must be at least 2 characters / الاسم يجب أن يكون أكثر من حرفين",
    "string.max": "Full name must not exceed 50 characters / الاسم لا يجب أن يزيد عن 50 حرف"
  }),
  phone: Joi.string().min(8).max(15).required().messages({
    "any.required": "Phone is required / رقم الهاتف مطلوب"
  }),
  city: Joi.string().required().messages({
    "any.required": "City is required / المدينة مطلوبة"
  }),
  street: Joi.string().required().messages({
    "any.required": "Street is required / الشارع مطلوب"
  }),
  building: Joi.string().required().messages({
    "any.required": "Building is required / المبنى مطلوب"
  }),
  notes: Joi.string().max(200).optional().allow(null, ""),
});

/* ----------------------------- Create Order ----------------------------- */
export const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    "array.min": "Order must contain at least one item / يجب أن يحتوي الطلب على عنصر واحد على الأقل",
    "any.required": "Order items are required / عناصر الطلب مطلوبة"
  }),
  shippingAddress: addressSchema.required(),
  paymentMethod: Joi.string().valid("COD", "STRIPE", "PAYPAL").required().messages({
    "any.only": "Payment method must be COD, STRIPE, or PAYPAL / طريقة الدفع غير صالحة",
    "any.required": "Payment method is required / طريقة الدفع مطلوبة"
  }),
  coupon: Joi.string().custom(mongoose.Types.ObjectId).optional().allow(null),
});

/* ----------------------------- Update Order ----------------------------- */
export const updateOrderSchema = Joi.object({
  orderStatus: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").optional(),
  paymentStatus: Joi.string().valid("pending", "paid", "failed", "refunded").optional(),
  shippingAddress: addressSchema.optional(),
});

/* ----------------------------- Delete Orders (Bulk) ----------------------------- */
export const deleteOrdersSchema = Joi.object({
  ids: Joi.array().items(Joi.string().custom(mongoose.Types.ObjectId)).min(1).required().messages({
    "array.min": "IDs array cannot be empty / مصفوفة الـ IDs لا يمكن أن تكون فارغة",
    "any.required": "IDs are required / الـ IDs مطلوبة"
  }),
});

/* ----------------------------- Get Orders By ID ----------------------------- */
export const getOrderByIdSchema = Joi.object({
  id: Joi.string().custom(mongoose.Types.ObjectId).required().messages({
    "any.required": "Order ID is required / الرقم المميز للطلب مطلوب"
  })
});
