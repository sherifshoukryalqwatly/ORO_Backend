import mongoose from "mongoose"
const { Schema, model } = mongoose;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon Code is Required / كود الكوبون مطلوب'],
      unique: true
    },

    discountType: {
      type: String,
      enum: {
        values: ['percentage', 'fixed'],
        message: 'Invalid Discount Type / نوع الخصم غير صالح'
      },
      required: [true, 'Discount Type is Required / نوع الخصم مطلوب']
    },

    discountValue: {
      type: Number,
      required: [true, 'Discount Value is Required / قيمة الخصم مطلوبة'],
      min: [1, 'Discount must be at least 1 / يجب أن يكون الخصم 1 على الأقل']
    },

    maxDiscountAmount: {
      type: Number,
      default: null // Optional: cap for percentage coupons
    },

    minCartValue: {
      type: Number,
      default: 0 // Minimum cart total required to apply coupon
    },

    expiresAt: {
      type: Date,
      required: [true, 'Expiration Date is Required / تاريخ انتهاء الصلاحية مطلوب']
    },

    usageLimit: {
      type: Number,
      default: null  // Global usage limit
    },

    usedCount: {
      type: Number,
      default: 0 // Tracks total times used
    },

    usageLimitPerUser: {
      type: Number,
      default: 1
    },

    active: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedAt: { type: Date }
  },
  { timestamps: true }
);

const Coupon = model("Coupon", couponSchema);
export default Coupon;