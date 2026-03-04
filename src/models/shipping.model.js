/* --------------------------------------------------------------------------
 * 🛳 Shipping Model
 * - Stores shipping information for orders
 * - Tracks carrier, tracking number, status, and estimated delivery
 * - Supports soft delete
 * -------------------------------------------------------------------------- */
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const shippingSchema = new Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, 'Order Id is required / الرقم المميز للطلب مطلوب']
    },

    carrier: {
      type: String,
      required: [true, 'Carrier is required / شركة الشحن مطلوبة']
    },

    trackingNumber: {
      type: String,
      required: [true, 'Tracking number is required / رقم التتبع مطلوب']
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "shipped", "in_transit", "delivered", "cancelled"],
        message: 'Invalid shipping status / حالة الشحن غير صالحة'
      },
      default: "pending"
    },

    estimatedDelivery: {
      type: Date
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

/* ----------------------------- Indexes ----------------------------- */
shippingSchema.index({ trackingNumber: 1 });
shippingSchema.index({ order: 1 });

/* ----------------------------- Soft Delete ----------------------------- */
shippingSchema.pre("save", function (next) {
  if (this.isDeleted && !this.deletedAt) this.deletedAt = new Date();
  if (!this.isDeleted) this.deletedAt = null;
});

const Shipping = model("Shipping", shippingSchema);
export default Shipping;
