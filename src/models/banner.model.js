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

const bannerSchema = new Schema(
  {
    title: {
      type: createLocalizedStringSchema(2, 100),
      required: true
    },

    subtitle: {
      type: createLocalizedStringSchema(2, 200, false),
      default: { en: '', ar: '' }
    },

    image: {
      public_id: {
        type: String,
        required: [true, 'Cloudinary public_id is required']
      },
      secure_url: {
        type: String,
        required: [true, 'Cloudinary secure_url is required']
      }
    },

    link: {
      type: String,
      trim: true,
      default: null
    },

    displayOrder: {
      type: Number,
      min: 0,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedAt: Date
  },
  { timestamps: true }
);


// Index for homepage queries
bannerSchema.index({ isActive: 1, isDeleted: 1, displayOrder: 1 });

// Soft delete consistency
bannerSchema.pre('save', function (next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }
});

const Banner = model("Banner", bannerSchema);
export default Banner;
