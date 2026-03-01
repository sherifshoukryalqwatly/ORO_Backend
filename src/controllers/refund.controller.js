import * as refundService from "../services/refund.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";
import { auditLogService } from "../services/auditlog.service.js";

// Helper function to log actions
const logAction = async ({ req, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: req.user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"]
  });
};
// USER – CREATE REFUND REQUEST
export const create = asyncWrapper(async (req, res) => {
  const refund = await refundService.create({
    ...req.body,
    user: req.user._id,
  });

   await logAction({
    req,
    action: "CREATE",
    targetModel: "Refund",
    targetId: refund._id,
    description: `Created new refund`
  });

  return appResponses.success(
    res,
    refund,
    "Refund request submitted successfully",
    201
  );
});

// ADMIN / USER
export const findById = asyncWrapper(async (req, res) => {
  const refund = await refundService.findById(req.params.id);
   await logAction({
    req,
    action: "VIEW",
    targetModel: "Refund",
    targetId: refund._id,
    description: `Viewed refund details`
  });
  return appResponses.success(res, refund);
});

// ADMIN
export const findAll = asyncWrapper(async (req, res) => {
  const data = await refundService.findAll(
    req.filters,
    req.sort,
    req.pagination
  );
   await logAction({
    req,
    action: "VIEW",
    targetModel: "Refund",
    targetId: data.refunds[0]._id,
    description: `Created new refund`
  });
  return appResponses.success(res, data);
});

// ADMIN – UPDATE STATUS
export const updateStatus = asyncWrapper(async (req, res) => {
  const refund = await refundService.updateStatus(
    req.params.id,
    req.body
  );

   await logAction({
    req,
    action: "UPDATE",
    targetModel: "Refund",
    targetId: refund._id,
    description: `Updated refund status`
  });
  return appResponses.success(
    res,
    refund,
    "Refund status updated successfully"
  );
});

// ADMIN – SOFT DELETE
export const remove = asyncWrapper(async (req, res) => {
  await refundService.remove(req.params.id);
   await logAction({
    req,
    action: "DELETE",
    targetModel: "Refund",
    targetId: req.params.id,
    description: `Deleted refund`
  });
  return appResponses.success(res, null, "Refund deleted successfully");
});

// HARD DELETE ORDER
export const hRemove = asyncWrapper(async (req, res) => {
  await refundService.hRemove(req.params.id);

  await logAction({
    req,
    action: "DELETE",
    targetModel: "Refund",
    targetId: req.params.id,
    description: "Hard deleted refund"
  });

  return appResponses.success(res, null, "Refund Deleted Permanently / تم حذف الاسترجاع نهائياً");
});
