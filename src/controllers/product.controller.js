import * as productService from "../services/product.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";

export const create = asyncWrapper(async (req, res) => {
  const product = await productService.create(req.body);
  return appResponses.success(res, product, "Product created successfully", 201);
});

export const findById = asyncWrapper(async (req, res) => {
  const product = await productService.findById(req.params.id);
  return appResponses.success(res, product);
});

export const findAll = asyncWrapper(async (req, res) => {
  const data = await productService.findAll(
    req.filters,
    req.sort,
    req.pagination
  );
  return appResponses.success(res, data);
});

export const update = asyncWrapper(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  return appResponses.success(res, product, "Product updated successfully");
});

export const remove = asyncWrapper(async (req, res) => {
  await productService.remove(req.params.id);
  return appResponses.success(res, null, "Product deleted successfully");
});
