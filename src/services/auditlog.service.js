// ==========================================
// 🔹 AUDIT LOG SERVICE — BUSINESS LOGIC
// ==========================================
import { auditLogRepo } from '../repos/auditlog.repo.js';
import ApiError from "../utils/ApiError.js";

export const auditLogService = {

  /* -------------------------------
     CREATE AUDIT LOG
  -------------------------------- */
  async createLog(data) {
    return auditLogRepo.create(data);
  },

  /* -------------------------------
     GET AUDIT LOG BY ID
  -------------------------------- */
  async getLogById(id) {
    const log = await auditLogRepo.findById(id);
    if (!log) throw ApiError.notFound("Audit log not found / السجل غير موجود");
    return log;
  },

  /* -------------------------------
     LIST ALL AUDIT LOGS
  -------------------------------- */
  async listLogs(filter = {}) {
    return auditLogRepo.findAll(filter);
  },

  /* -------------------------------
     DELETE AUDIT LOG
  -------------------------------- */
  async deleteLog(id) {
    const deleted = await auditLogRepo.removeById(id);
    if (!deleted) throw ApiError.notFound("Audit log not found / السجل غير موجود");
    return deleted;
  }
};