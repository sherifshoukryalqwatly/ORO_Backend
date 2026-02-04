import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* ----------------------------- Localization Schema ----------------------------- */
function createLocalizedStringSchema(min = 2, max = 500, required = true) {
  return new Schema(
    {
      ar: {
        type: String,
        trim: true,
        required: required ? [true, `النص العربي مطلوب`] : false,
        minlength: [min, `النص العربي يجب أن لا يقل عن ${min} أحرف`],
        maxlength: [max, `النص العربي يجب أن لا يزيد عن ${max} أحرف`],
      },
      en: {
        type: String,
        trim: true,
        required: required ? [true, `English text is required`] : false,
        minlength: [min, `Text must be at least ${min} characters long`],
        maxlength: [max, `Text must not exceed ${max} characters`],
      },
    },
    { _id: false }
  );
}

const CategorySchema = new Schema(
  {
    name: createLocalizedStringSchema(2, 50),

    slug: {
      en: { type: String },
      ar: { type: String }
    },

    image: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },

    isActive: { type: Boolean, default: true },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

// 🔹 Slug generation (ONLY when name changes)
CategorySchema.pre("save", function (next) {
  if (this.isModified("name.en") && this.name?.en) {
    this.slug.en = this.name.en
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  if (this.isModified("name.ar") && this.name?.ar) {
    this.slug.ar = this.name.ar
      .trim()
      .replace(/\s+/g, "-");
  }

  next();
});

// 🔹 Soft delete consistency
CategorySchema.pre("save", function (next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }

  next();
});

// 🔹 Indexes
CategorySchema.index({ "slug.en": 1 }, { unique: true, sparse: true });
CategorySchema.index({ "slug.ar": 1 }, { unique: true, sparse: true });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1, isDeleted: 1 });

const Category = model("Category", CategorySchema);
export default Category;
