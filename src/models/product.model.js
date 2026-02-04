import mongoose from "mongoose"
const { Schema, model } = mongoose;

/* ----------------------------- Localization Schema ----------------------------- */
function createLocalizedStringSchema(min = 2, max = 500, required = true) {
  return new Schema(
    {
      ar: {
        type: String,
        trim: true,
        required: required ? [true, `النص العربي مطلوب`] : false,
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

const productSchema = new Schema(
    {
        title: createLocalizedStringSchema(2, 50),
        description: createLocalizedStringSchema(5, 500),
        slug: { type: String, required: true, unique: true },
        price: {
            type: Number,
            required: [true, "Price is Required / السعر مطلوب"],
            min: [0, "Price must be positive"],
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        stock: { type: Number, default: 0 },
        material: { type: String, default: null }, // stainless steel, glass, silicone, etc.
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is Required / الفئة مطلوبة"],
        },
        brand: {
            type: String,
            required: [true, "Brand is Required / الماركة مطلوبة"],
        },
        images: {
            type: [String],
            required: [true, "Images Array Required / مصفوفة الصور مطلوبة"],
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        ratingsCount: {
            type: Number,
            default: 0,
        },
        sold: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        sDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);
// Auto-generate slug based on title
productSchema.pre("save", async function () {
  if (this.title?.en) {
    this.slug.en = this.title.en.toLowerCase().replace(/ /g, "-");
  }
  if (this.title?.ar) {
    this.slug.ar = this.title.ar.replace(/ /g, "-");
  }
});
/* ----------------------------- Virtual: finalPrice ----------------------------- */
productSchema.virtual("finalPrice").get(function () {
  if (this.discount > 0) {
    return Number((this.price - (this.price * this.discount) / 100).toFixed(2));
  }
  return this.price;
});
/* ----------------------------- Full Text Search Index ----------------------------- */
productSchema.index({
  "title.en": "text",
  "title.ar": "text",
  "description.en": "text",
  "description.ar": "text",
  brand: "text",
});
/* ----------------------------- Soft Delete Middleware ----------------------------- */
// For find, findOne, etc.
productSchema.pre(/^find/, function() {
  this.where({ isDeleted: false });
});

productSchema.pre('aggregate', function() {
  // Insert a $match stage at the beginning
  this.pipeline().unshift({ $match: { isDeleted: false } });
});

const Product = model('Product', productSchema);
export default Product;