// ==========================================
// 🔹 AUDIT LOG CONTROLLER — HTTP RESPONSE LAYER
// ==========================================
import asyncWrapper from "../utils/asyncHandler.js";
import { auditLogService } from "../services/auditlog.service.js";
import { appResponses } from "../utils/ApiResponse.js";
import { StatusCodes } from "../utils/constants.js";

export const auditLogController = {

  /* -------------------------------
     CREATE AUDIT LOG
  -------------------------------- */
  createLog: asyncWrapper(async (req, res) => {
    const logData = {
      ...req.body,
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || null
    };
    const log = await auditLogService.createLog(logData);
    return appResponses.success(res, log, "Audit log created successfully / تم إنشاء السجل بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET AUDIT LOG BY ID
  -------------------------------- */
  getLogById: asyncWrapper(async (req, res) => {
    const log = await auditLogService.getLogById(req.params.id);
    return appResponses.success(res, log, "Audit log fetched successfully / تم جلب السجل بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL AUDIT LOGS
  -------------------------------- */
  listLogs: asyncWrapper(async (req, res) => {
    const logs = await auditLogService.listLogs();
    return appResponses.success(res, logs, "Audit logs fetched successfully / تم جلب جميع السجلات بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE AUDIT LOG
  -------------------------------- */
  deleteLog: asyncWrapper(async (req, res) => {
    const deleted = await auditLogService.deleteLog(req.params.id);
    return appResponses.success(res, deleted, "Audit log deleted successfully / تم حذف السجل بنجاح", StatusCodes.OK);
  })
};