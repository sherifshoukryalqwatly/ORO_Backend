import mongoose from "mongoose";
const { Schema, model } = mongoose;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon Code is Required / كود الكوبون مطلوب'],
      trim: true,
      uppercase: true,
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
      default: null
    },

    minCartValue: {
      type: Number,
      default: 0
    },

    expiresAt: {
      type: Date,
      required: [true, 'Expiration Date is Required / تاريخ انتهاء الصلاحية مطلوب']
    },

    usageLimit: {
      type: Number,
      default: null
    },

    usedCount: {
      type: Number,
      default: 0
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

// 🔹 Indexes
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ active: 1, isDeleted: 1 });
couponSchema.index({ expiresAt: 1 });

// 🔹 Normalize & validate coupon
couponSchema.pre('save', function (next) {
  if (this.isModified('code')) {
    this.code = this.code.trim().toUpperCase();
  }

  if (
    this.discountType === 'percentage' &&
    this.discountValue > 100
  ) {
    return next(
      new Error('Percentage discount cannot exceed 100%')
    );
  }

  if (this.expiresAt && this.expiresAt < new Date()) {
    this.active = false;
  }

  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }

  next();
});

const Coupon = model("Coupon", couponSchema);
export default Coupon;
