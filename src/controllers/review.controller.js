import * as reviewService from "../services/review.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";

// USER – CREATE REVIEW
export const create = asyncWrapper(async (req, res) => {
  const review = await reviewService.create({
    ...req.body,
    user: req.user._id,
  });

  return appResponses.success(
    res,
    review,
    "Review added successfully",
    201
  );
});

// USER / ADMIN
export const findById = asyncWrapper(async (req, res) => {
  const review = await reviewService.findById(req.params.id);
  return appResponses.success(res, review);
});

// PUBLIC
export const findByProduct = asyncWrapper(async (req, res) => {
  const data = await reviewService.findByProduct(
    req.params.productId,
    req.pagination
  );

  return appResponses.success(res, data);
});

// ADMIN
export const findAll = asyncWrapper(async (req, res) => {
  const data = await reviewService.findAll(
    req.filters,
    req.sort,
    req.pagination
  );

  return appResponses.success(res, data);
});

// USER – UPDATE OWN REVIEW
export const update = asyncWrapper(async (req, res) => {
  const review = await reviewService.update(
    req.params.id,
    req.body
  );

  return appResponses.success(
    res,
    review,
    "Review updated successfully"
  );
});

// USER / ADMIN – DELETE
export const remove = asyncWrapper(async (req, res) => {
  await reviewService.remove(req.params.id);
  return appResponses.success(res, null, "Review deleted successfully");
});
