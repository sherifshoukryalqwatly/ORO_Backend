// ==========================================
// 🔹 AUDIT LOG REPO — DATABASE OPERATIONS ONLY
// ==========================================
import AuditLog from "../models/auditlog.model.js";

export const auditLogRepo = {

  /* -------------------------------
     CREATE AUDIT LOG
  -------------------------------- */
  create(data) {
    return AuditLog.create(data);
  },

  /* -------------------------------
     FIND AUDIT LOG BY ID
  -------------------------------- */
  findById(id) {
    return AuditLog.findById(id).populate("user");
  },

  /* -------------------------------
     LIST ALL AUDIT LOGS
  -------------------------------- */
  findAll(filter = {}) {
    return AuditLog.find({ ...filter, isDeleted: false }).populate("user");
  },

  /* -------------------------------
     SOFT DELETE AUDIT LOG
  -------------------------------- */
  removeById(id) {
    return AuditLog.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }
};