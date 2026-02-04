import mongoose from "mongoose";
const { Schema, model } = mongoose;

const favouriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ],

    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 🔹 Enforce one wishlist per user
favouriteSchema.index({ user: 1 }, { unique: true });

// 🔹 Deduplicate products
favouriteSchema.pre('save', function (next) {
  if (this.products?.length) {
    this.products = [...new Set(this.products.map(id => id.toString()))];
  }
  next();
});

// 🔹 Soft delete consistency
favouriteSchema.pre('save', function (next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }

  next();
});

const Favourite = model("Favourite", favouriteSchema);
export default Favourite;
