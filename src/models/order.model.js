import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* ----------------------------- Order Item ----------------------------- */
const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    priceAtTime: {
      type: Number,
      required: true
    },

    totalItemPrice: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

/* ----------------------------- Address Snapshot ----------------------------- */
const addressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    building: { type: String, required: true },
    notes: String
  },
  { _id: false }
);

/* ----------------------------- Order ----------------------------- */
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: {
      type: [orderItemSchema],
      validate: [
        v => v.length > 0,
        'Order must contain at least one item'
      ]
    },

    shippingAddress: {
      type: addressSchema,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'STRIPE', 'PAYPAL'],
      required: true
    },

    paymentStatus: {
      type: String,
      lowercase: true,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },

    orderStatus: {
      type: String,
      lowercase: true,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },

    paymentIntentId: {
      type: String,
      default: null
    },

    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null
    },

    couponDiscount: {
      type: Number,
      default: 0
    },

    subtotalPrice: {
      type: Number,
      required: true
    },

    shippingFee: {
      type: Number,
      required: true
    },

    finalPrice: {
      type: Number,
      required: true
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* ----------------------------- Virtuals ----------------------------- */
orderSchema.virtual('totalQuantity').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

/* ----------------------------- Indexes ----------------------------- */
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ isDeleted: 1 });

/* ----------------------------- Soft Delete ----------------------------- */
orderSchema.pre('save', function (next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }
});

const Order = model("Order", orderSchema);
export default Order;
