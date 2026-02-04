import mongoose from "mongoose";
const { Schema, model } = mongoose;

const refundSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, 'Order Id is Required / الرقم المميز للطلب مطلوب']
    },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, 'Payment Id is Required / الرقم المميز للدفع مطلوب']
    },

    amount: {
      type: Number,
      required: [true, 'Refund Amount is Required / مبلغ الاسترجاع مطلوب'],
      min: [1, 'Refund amount must be at least 1 / يجب أن يكون مبلغ الاسترجاع 1 على الأقل']
    },

    reason: {
      type: String,
      required: [true, 'Refund Reason is Required / سبب الاسترجاع مطلوب']
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    },

    notes: { type: String },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

/* ----------------------------- Indexes ----------------------------- */
refundSchema.index({ user: 1 });
refundSchema.index({ order: 1 });
refundSchema.index({ payment: 1 });
refundSchema.index({ status: 1 });
refundSchema.index({ createdAt: -1 });
refundSchema.index(
  { payment: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

/* ----------------------------- Soft Delete ----------------------------- */
refundSchema.pre('save', function(next) {
  if (this.isDeleted && !this.deletedAt) this.deletedAt = new Date();
  if (!this.isDeleted) this.deletedAt = null;
  next();
});

/* ----------------------------- Refund Rules ----------------------------- */
refundSchema.pre('save', async function(next) {
  const Payment = mongoose.model('Payment');
  const payment = await Payment.findById(this.payment);

  if (!payment) return next(new Error('Associated payment not found'));

  if (payment.status !== 'completed') {
    return next(new Error('Refund can only be created for completed payments'));
  }

  if (this.amount > payment.amount) {
    return next(new Error('Refund amount cannot exceed payment amount'));
  }

  next();
});

/* ----------------------------- Sync Payment & Order ----------------------------- */
refundSchema.post('save', async function(doc) {
  if (doc.status === 'completed') {
    await mongoose.model('Payment').findByIdAndUpdate(doc.payment, {
      status: 'refunded'
    });

    await mongoose.model('Order').findByIdAndUpdate(doc.order, {
      paymentStatus: 'refunded',
      orderStatus: 'cancelled'
    });
  }
});

const Refund = model("Refund", refundSchema);
export default Refund;
