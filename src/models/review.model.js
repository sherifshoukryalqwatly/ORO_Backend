import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true,'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true,'Product Id is Required / الرقم المميز للمنتج مطلوب']
    },

    rating: {
      type: Number,
      required: [true,'Rating is Required / التقييم مطلوب'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not exceed 5']
    },

    comment: {
      type: String,
      default: ""
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

/* -------------------- Unique Review Per User Per Product -------------------- */
reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

/* -------------------- Soft Delete -------------------- */
reviewSchema.pre("save", function (next) {
  if (this.isDeleted && !this.deletedAt) this.deletedAt = new Date();
  if (!this.isDeleted) this.deletedAt = null;
  next();
});

reviewSchema.pre(/^find/, function () {
  this.where({ isDeleted: false });
});

/* -------------------- Recalculate Product Ratings -------------------- */
reviewSchema.statics.calcRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId, isDeleted: false }
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingsAverage: Number(stats[0].avgRating.toFixed(2)),
      ratingsCount: stats[0].ratingsCount
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsCount: 0
    });
  }
};

/* -------------------- After Create / Update -------------------- */
reviewSchema.post("save", async function () {
  await this.constructor.calcRatings(this.product);
});

/* -------------------- After Update / Delete -------------------- */
reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await doc.constructor.calcRatings(doc.product);
  }
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcRatings(doc.product);
  }
});

const Review = model("Review", reviewSchema);
export default Review;
