import * as refundService from "../services/refund.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";

// USER – CREATE REFUND REQUEST
export const create = asyncWrapper(async (req, res) => {
  const refund = await refundService.create({
    ...req.body,
    user: req.user._id,
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
  return appResponses.success(res, refund);
});

// ADMIN
export const findAll = asyncWrapper(async (req, res) => {
  const data = await refundService.findAll(
    req.filters,
    req.sort,
    req.pagination
  );
  return appResponses.success(res, data);
});

// ADMIN – UPDATE STATUS
export const updateStatus = asyncWrapper(async (req, res) => {
  const refund = await refundService.updateStatus(
    req.params.id,
    req.body
  );

  return appResponses.success(
    res,
    refund,
    "Refund status updated successfully"
  );
});

// ADMIN – SOFT DELETE
export const remove = asyncWrapper(async (req, res) => {
  await refundService.remove(req.params.id);
  return appResponses.success(res, null, "Refund deleted successfully");
});
