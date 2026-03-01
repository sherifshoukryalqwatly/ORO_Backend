import mongoose from "mongoose";
const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'STRIPE', 'PAYPAL'],
      required: true
    },

    transactionId: {
      type: String,
      default: null
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      lowercase: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },

    currency: {
      type: String,
      default: 'EGP'
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

/* ----------------------------- Indexes ----------------------------- */
paymentSchema.index({ user: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ isDeleted: 1 });

/* ----------------------------- Soft Delete ----------------------------- */
paymentSchema.pre('save', function (next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }

});

/* ----------------------------- Payment Rules ----------------------------- */
paymentSchema.pre('save', function (next) {
  if (this.paymentMethod === 'COD') {
    this.transactionId = null;
  }

  if (['STRIPE', 'PAYPAL'].includes(this.paymentMethod) && !this.transactionId) {
    return next(new Error('Transaction ID is required for online payments'));
  }

});

const Payment = model("Payment", paymentSchema);
export default Payment;
