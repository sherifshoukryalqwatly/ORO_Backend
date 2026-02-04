/* --------------------------------------------------------------------------
 * 📦 Inventory Model
 * - Tracks stock levels of products and their variants
 * - Supports multiple variants per product (size, color)
 * - Supports soft delete
 * -------------------------------------------------------------------------- */
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const inventorySchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, 'Product Id is required / الرقم المميز للمنتج مطلوب']
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required / الكمية مطلوبة'],
      min: [0, 'Quantity must be at least 0 / يجب أن تكون الكمية 0 على الأقل']
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

const Inventory = model("Inventory", inventorySchema);
export default Inventory;