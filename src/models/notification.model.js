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

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is required / الرقم المميز للمستخدم مطلوب']
    },

    type: {
      type: String,
      uppercase: true,
      enum: ['INFO', 'PROMOTION', 'ORDER', 'REFUND', 'SYSTEM'],
      required: [true, 'Notification type is required / نوع الإشعار مطلوب']
    },

    title: {
      type: createLocalizedStringSchema(2, 100),
      required: true
    },

    message: {
      type: createLocalizedStringSchema(2, 300),
      required: true
    },

    link: {
      type: String,
      trim: true,
      default: null
    },

    isRead: {
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

// 🔹 Indexes for fast reads
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ isDeleted: 1 });

// 🔹 Soft delete consistency
notificationSchema.pre('save', function (next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }

  next();
});

const Notification = model("Notification", notificationSchema);
export default Notification;
