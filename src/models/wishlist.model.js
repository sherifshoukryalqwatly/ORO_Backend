import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* ----------------------------- Wishlist Item ----------------------------- */
const wishlistItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    variant: {
      type: Schema.Types.ObjectId,
      default: null
    },

    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

/* ----------------------------- Wishlist Schema ----------------------------- */
const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    items: [wishlistItemSchema],

    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

wishlistSchema.pre(/^find/, function () {
  this.where({ isDeleted: false });
});

wishlistSchema.pre("save", function () {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }

});

wishlistSchema.index(
  { user: 1, "items.product": 1, "items.variant": 1 },
  { unique: true }
);

const Wishlist = model('Wishlist',wishlistSchema);

export default Wishlist;