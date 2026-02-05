import mongoose from "mongoose";
const { Schema, model } = mongoose;

const auditLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    action: {
      type: String,
      uppercase: true,
      required: [true, 'Action is Required / الإجراء مطلوب'],
      enum: [
        'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
        'PAYMENT', 'ORDER', 'REFUND', 'COUPON', 'CART', 'FAVOURITE', 'READ'
      ]
    },

    targetModel: {
      type: String,
      required: [true, 'Target Model is Required / النموذج المستهدف مطلوب'],
      trim: true
    },

    targetId: {
      type: Schema.Types.ObjectId,
      default: null
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      required: [true, 'Description is Required / الوصف مطلوب']
    },

    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

// Indexes for performance
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ targetModel: 1, targetId: 1 });
auditLogSchema.index({ createdAt: -1 });

// Prevent updates (immutability)
auditLogSchema.pre("save", function () {
  if (!this.isNew) {
    throw new Error("Audit logs cannot be modified");
  }
});

const AuditLog = model("AuditLog", auditLogSchema);
export default AuditLog;
