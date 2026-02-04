import mongoose from "mongoose";
const { Schema, model } = mongoose;

const refundSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, 'Order Id is Required / الرقم المميز للطلب مطلوب']
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
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

    notes: {
      type: String
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

const Refund = model("Refund", refundSchema);
export default Refund;