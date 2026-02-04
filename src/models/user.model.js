import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { decryptRSA, encryptRSA } from "../utils/bcrypt.js";
import { globalRegex } from "../utils/constants.js";

const { Schema, model } = mongoose;

/* =====================
    USER
===================== */
const userSchema = new Schema(
  {
    googleid: {
      type: String,
      unique: [true, "Google ID must be unique / يجب أن يكون معرف جوجل فريدًا"],
      sparse: true,
    },

    loginMethods: {
      type: [String],
      enum: ["local", "google"],
      default: ["local"],
    },

    firstName: {
      type: String,
      required: [true, "First Name is Required / الاسم الاول مطلوب"],
      trim: true,
      minlength: [2, "Fitst Name must be at least two characters long / الاسم الاول يجب على الاقل حرفين "],
      maxlength: [20, "Fitst Name must not exceed 20 characters / الاسم الاول يجب على الاكثر 20 حرف "],
    },

    lastName: {
      type: String,
      required: [true, "Last Name is Required / الاسم الاخير مطلوب"],
      trim: true,
      minlength: [2, "Last Name must be at least two characters long / الاسم الاخير يجب على الاقل حرفين "],
      maxlength: [20, "Last Name must not exceed 20 characters / الاسم الاخير يجب على الاكثر 20 حرف "],
    },

    email: {
      type: String,
      required: [true, "Email is Required / البريد الالكترونى مطلوب"],
      unique: [true, "Already Registered / مسجل بالفعل"],
      lowercase: true,
      validate: {
        validator: value => globalRegex.emailRegex.test(value),
        message: props =>
          `"${props.value}" is not a valid email address / "${props.value}" ليس عنوان بريد إلكتروني صالح`,
      },
    },

    password: {
      type: String,
      required: [
        function () {
          return !this.googleid;
        },
        "Password is required / الرقم السري مطلوب",
      ],
      validate: [
        {
          validator: function (value) {
            if (this.googleid) return true;
            return value && value.length >= 8 && value.length <= 100;
          },
          message:
            "Password must be between 8 and 100 characters / كلمة المرور يجب أن تكون بين 8 و 100 حرف",
        },
        {
          validator: function (value) {
            if (this.googleid) return true;
            return globalRegex.passwordRegex.test(value);
          },
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character / كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل وحرف صغير واحد ورقم واحد وحرف خاص واحد",
        },
      ],
    },

    phoneType: {
      type: String,
      enum: ["mobile", "home", "work"],
      default: "mobile",
    },

    phoneNumber: {
      type: String,
      required: [
        function () {
          return !this.googleid;
        },
        "Phone number is required / رقم الهاتف مطلوب",
      ],
      unique: [true, "Phone number must be unique / يجب أن يكون رقم الهاتف فريدًا"],
      sparse: true,
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not supported / {VALUE} غير مدعوم",
      },
      default: "user",
    },

    isVerified: { type: Boolean, default: false },

    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],

    otpCode: Number,
    otpExpiresAt: Date,

    resetPasswordToken: String,
    resetPasswordExpiry: Date,

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.phoneNumber = safeDecryptRSA(ret.phoneNumber);

        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.googleid;

        return ret;
      },
    },
  }
);

/* ----------------------------- Helpers ----------------------------- */
function safeDecryptRSA(value) {
  if (!value) return null;
  try {
    return decryptRSA(value);
  } catch {
    return value;
  }
}

/* ----------------------------- Pre Save ----------------------------- */
userSchema.pre("save", async function (next) {
  try {
    // 🔐 hash password
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // 🔒 encrypt phone
    if (this.isModified("phoneNumber") && this.phoneNumber) {
      this.phoneNumber = encryptRSA(this.phoneNumber);
    }

    // 🗑 soft delete timestamp
    if (this.isDeleted && !this.deletedAt) this.deletedAt = new Date();
    if (!this.isDeleted) this.deletedAt = null;

    next();
  } catch (err) {
    next(err);
  }
});

/* ----------------------------- Soft Delete ----------------------------- */
userSchema.pre(/^find/, function () {
  this.where({ isDeleted: false });
});

const User = model("User", userSchema);
export default User;
