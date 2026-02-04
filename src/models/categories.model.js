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
    name: createLocalizedStringSchema(2,50),

    slug: {
      en: { type: String, unique: true },
      ar: { type: String, unique: true }
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },

    isActive: { type: Boolean, default: true },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

// Auto-generate slug based on name
CategorySchema.pre("save", async function () {
  if (this.name?.en) {
    this.slug.en = this.name.en.toLowerCase().replace(/ /g, "-");
  }
  if (this.name?.ar) {
    this.slug.ar = this.name.ar.replace(/ /g, "-");
  }
});

const Category = model("Category", CategorySchema);
export default Category;