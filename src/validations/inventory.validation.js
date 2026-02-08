import Joi from "joi";
import mongoose from "mongoose";

// Custom validator for ObjectId
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

// ------------------- CREATE / UPDATE -------------------
export const createInventorySchema = Joi.object({
    product: Joi.string().custom(objectIdValidator).required().messages({
        "any.required": "Product Id is required / الرقم المميز للمنتج مطلوب",
        "any.invalid": "Invalid Product Id / Id المنتج غير صالح"
    }),
    quantity: Joi.number().min(0).required().messages({
        "any.required": "Quantity is required / الكمية مطلوبة",
        "number.min": "Quantity must be at least 0 / يجب أن تكون الكمية 0 على الأقل"
    })
});

export const updateInventorySchema = Joi.object({
    product: Joi.string().custom(objectIdValidator).messages({
        "any.invalid": "Invalid Product Id / Id المنتج غير صالح"
    }),
    quantity: Joi.number().min(0).messages({
        "number.min": "Quantity must be at least 0 / يجب أن تكون الكمية 0 على الأقل"
    })
});

// ------------------- ID PARAM -------------------
export const inventoryIdSchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required().messages({
        "any.required": "Inventory Id is required / الرقم المميز للمخزون مطلوب",
        "any.invalid": "Invalid Inventory Id / Id المخزون غير صالح"
    })
});

// ------------------- BULK DELETE -------------------
export const deleteInventoriesSchema = Joi.object({
    ids: Joi.array().items(Joi.string().custom(objectIdValidator).messages({
        "any.invalid": "Invalid Inventory Id / Id المخزون غير صالح"
    })).min(1).required().messages({
        "any.required": "IDs array is required / مصفوفة Ids مطلوبة",
        "array.min": "At least one ID is required / يجب إدخال Id واحد على الأقل"
    })
});
