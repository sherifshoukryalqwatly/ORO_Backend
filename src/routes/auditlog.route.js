// ==========================================
// 🔹 AUDIT LOG ROUTES
// ==========================================
import express from "express";
import { auditLogController } from "../controllers/auditlog.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import { createAuditLogSchema } from "../validations/auditlog.validation.js";

const router = express.Router();

router.use(isAuthenticated);

// Create Audit Log
router.post("/", validationMiddleware(createAuditLogSchema), auditLogController.createLog);

// Get Audit Log by ID
router.get("/:id", auditLogController.getLogById);

// List All Audit Logs (Admin)
router.get("/", auditLogController.listLogs);

// Delete Audit Log
router.delete("/:id", auditLogController.deleteLog);

export default router;