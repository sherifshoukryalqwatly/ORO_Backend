import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* ----------------------------- Localization ----------------------------- */
function createLocalizedStringSchema(min = 2, max = 500, required = true) {
  return new Schema(
    {
      ar: {
        type: String,
        trim: true,
        required: required ? [true, "النص العربي مطلوب"] : false,
        minlength: [min, `النص العربي يجب ألا يقل عن ${min} أحرف`],
        maxlength: [max, `النص العربي يجب ألا يزيد عن ${max} أحرف`],
      },
      en: {
        type: String,
        trim: true,
        required: required ? [true, "English text is required"] : false,
        minlength: [min, `Text must be at least ${min} characters`],
        maxlength: [max, `Text must not exceed ${max} characters`],
      },
    },
    { _id: false }
  );
}

/* ----------------------------- Product Schema ----------------------------- */
const productSchema = new Schema(
  {
    title: createLocalizedStringSchema(2, 50),
    description: createLocalizedStringSchema(5, 500),

    slug: {
      en: {
        type: String,
        unique: [true, "English slug must be unique / الرابط الإنجليزي يجب أن يكون فريدًا"],
      },
      ar: {
        type: String,
        unique: [true, "Arabic slug must be unique / الرابط العربي يجب أن يكون فريدًا"],
      },
    },

    price: {
      type: Number,
      required: [true, "Price is Required / السعر مطلوب"],
      min: [0, "Price must be positive / السعر يجب أن يكون رقمًا موجبًا"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be at least 0 / الخصم لا يمكن أن يكون أقل من 0"],
      max: [100, "Discount cannot exceed 100% / الخصم لا يمكن أن يزيد عن 100%"],
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock must be at least 0 / المخزون لا يمكن أن يكون أقل من 0"],
    },

    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold count cannot be negative / عدد المبيعات لا يمكن أن يكون سالبًا"],
    },

    material: {
      type: String,
      default: null,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is Required / الفئة مطلوبة"],
    },

    brand: {
      type: String,
      required: [true, "Brand is Required / الماركة مطلوبة"],
    },

    images: [
      {
        public_id: {
          type: String,
          required: [true, "Image public_id is required / المعرّف الخاص بالصورة مطلوب"],
        },
        secure_url: {
          type: String,
          required: [true, "Image secure_url is required / رابط الصورة مطلوب"],
        },
      },
    ],

    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0 / التقييم لا يمكن أن يقل عن 0"],
      max: [5, "Rating cannot exceed 5 / التقييم لا يمكن أن يزيد عن 5"],
    },

    ratingsCount: {
      type: Number,
      default: 0,
      min: [0, "Ratings count cannot be negative / عدد التقييمات لا يمكن أن يكون سالبًا"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/* ----------------------------- Slug Generator ----------------------------- */
productSchema.pre("save", function (next) {
  if (this.isModified("title.en")) {
    this.slug.en = this.title.en
      .toLowerCase()
      .trim()
      .replace(/[^\w]+/g, "-");
  }

  if (this.isModified("title.ar")) {
    this.slug.ar = this.title.ar.trim().replace(/\s+/g, "-");
  }

});

/* ----------------------------- Virtual: Final Price ----------------------------- */
productSchema.virtual("finalPrice").get(function () {
  return this.discount > 0
    ? Number((this.price - (this.price * this.discount) / 100).toFixed(2))
    : this.price;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

/* ----------------------------- Soft Delete Middleware ----------------------------- */

productSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { isDeleted: false } });
});

productSchema.pre("save", function (next) {
  if (this.isDeleted && !this.deletedAt) this.deletedAt = new Date();
  if (!this.isDeleted) this.deletedAt = null;
});

/* ----------------------------- Indexes ----------------------------- */
productSchema.index({
  "title.en": "text",
  "title.ar": "text",
  "description.en": "text",
  "description.ar": "text",
  brand: "text",
});

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ sold: -1 });
productSchema.index({ ratingsAverage: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isDeleted: 1 });

const Product = model("Product", productSchema);
export default Product;
