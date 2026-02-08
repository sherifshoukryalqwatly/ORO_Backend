import Joi from "joi";

// ------------------- CREATE / UPDATE -------------------
export const createNotificationSchema = Joi.object({
    user: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid User Id / Id المستخدم غير صالح",
            "any.required": "User Id is required / الرقم المميز للمستخدم مطلوب"
        }),

    type: Joi.string()
        .valid("INFO", "PROMOTION", "ORDER", "REFUND", "SYSTEM")
        .required()
        .messages({
            "any.only": "Invalid Notification Type / نوع الإشعار غير صالح",
            "any.required": "Notification type is required / نوع الإشعار مطلوب"
        }),

    title: Joi.object({
        en: Joi.string().min(2).max(100).required(),
        ar: Joi.string().min(2).max(100).required()
    }).required(),

    message: Joi.object({
        en: Joi.string().min(2).max(300).required(),
        ar: Joi.string().min(2).max(300).required()
    }).required(),

    link: Joi.string().uri().optional().allow(null),

    isRead: Joi.boolean().optional()
});

export const updateNotificationSchema = Joi.object({
    type: Joi.string()
        .valid("INFO", "PROMOTION", "ORDER", "REFUND", "SYSTEM")
        .optional(),

    title: Joi.object({
        en: Joi.string().min(2).max(100).optional(),
        ar: Joi.string().min(2).max(100).optional()
    }).optional(),

    message: Joi.object({
        en: Joi.string().min(2).max(300).optional(),
        ar: Joi.string().min(2).max(300).optional()
    }).optional(),

    link: Joi.string().uri().optional().allow(null),
    isRead: Joi.boolean().optional()
});

// ------------------- BULK OPERATIONS -------------------
export const bulkIdsSchema = Joi.object({
    ids: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .required()
        .messages({
            "array.base": "IDs must be an array / يجب أن تكون IDs مصفوفة",
            "array.min": "At least one ID is required / مطلوب على الأقل Id واحد",
            "any.required": "IDs array is required / مصفوفة IDs مطلوبة"
        })
});
