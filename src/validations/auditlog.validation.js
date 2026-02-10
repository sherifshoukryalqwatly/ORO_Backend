// ==========================================
// 🔹 AUDIT LOG VALIDATION — JOI SCHEMAS
// ==========================================
import Joi from "joi";

export const createAuditLogSchema = Joi.object({
  action: Joi.string()
    .valid('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PAYMENT', 'ORDER', 'REFUND', 'COUPON', 'CART', 'WISHLIST','READ')
    .required(),
  targetModel: Joi.string().required(),
  targetId: Joi.string().optional().allow(null),
  description: Joi.string().required(),
  ipAddress: Joi.string().optional().allow(null),
  userAgent: Joi.string().optional().allow(null)
});