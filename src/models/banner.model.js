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

const bannerSchema = new Schema(
  {
    title: {
      type: createLocalizedStringSchema(2,100),
      required: [true, 'Banner title is required / عنوان البانر مطلوب']
    },

    subtitle: {
      type: createLocalizedStringSchema(2,200),
      default: { en: '', ar: '' }
    },

    image: {
      type: String,
      required: [true, 'Banner image URL is required / رابط صورة البانر مطلوب']
    },

    link: {
      type: String,
      default: null // optional: redirect link when clicked
    },

    displayOrder: {
      type: Number,
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

    deletedAt: { type: Date }
  },
  { timestamps: true }
);

const Banner = model("Banner", bannerSchema);
export default Banner;