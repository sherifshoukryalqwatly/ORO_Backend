import * as paymentService from "../services/payment.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";

export const create = asyncWrapper(async (req, res) => {
  const payment = await paymentService.create({
    ...req.body,
    user: req.user.id
  });

  return appResponses.success(
    res,
    payment,
    "Payment created successfully",
    201
  );
});

export const findById = asyncWrapper(async (req, res) => {
  const payment = await paymentService.findById(req.params.id);
  return appResponses.success(res, payment);
});

export const findAll = asyncWrapper(async (req, res) => {
  const data = await paymentService.findAll(
    req.filters,
    req.sort,
    req.pagination
  );
  return appResponses.success(res, data);
});

export const findMyPayments = asyncWrapper(async (req, res) => {
  const data = await paymentService.findByUser(
    req.user.id,
    req.filters,
    req.sort,
    req.pagination
  );
  return appResponses.success(res, data);
});

export const update = asyncWrapper(async (req, res) => {
  const payment = await paymentService.update(req.params.id, req.body);
  return appResponses.success(res, payment, "Payment updated successfully");
});

export const remove = asyncWrapper(async (req, res) => {
  await paymentService.remove(req.params.id);
  return appResponses.success(res, null, "Payment deleted successfully");
});
