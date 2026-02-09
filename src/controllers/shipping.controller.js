import * as shippingService from "../services/shipping.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";

// ADMIN – CREATE SHIPPING
export const create = asyncWrapper(async (req, res) => {
  const shipping = await shippingService.create(req.body);

  return appResponses.success(
    res,
    shipping,
    "Shipping created successfully",
    201
  );
});

// ADMIN / USER
export const findById = asyncWrapper(async (req, res) => {
  const shipping = await shippingService.findById(req.params.id);
  return appResponses.success(res, shipping);
});

export const findByOrder = asyncWrapper(async (req, res) => {
  const shipping = await shippingService.findByOrder(req.params.orderId);
  return appResponses.success(res, shipping);
});

// ADMIN
export const findAll = asyncWrapper(async (req, res) => {
  const data = await shippingService.findAll(
    req.filters,
    req.sort,
    req.pagination
  );
  return appResponses.success(res, data);
});

// ADMIN – UPDATE STATUS / TRACKING
export const update = asyncWrapper(async (req, res) => {
  const shipping = await shippingService.update(
    req.params.id,
    req.body
  );

  return appResponses.success(
    res,
    shipping,
    "Shipping updated successfully"
  );
});

// ADMIN – SOFT DELETE
export const remove = asyncWrapper(async (req, res) => {
  await shippingService.remove(req.params.id);
  return appResponses.success(res, null, "Shipping deleted successfully");
});
