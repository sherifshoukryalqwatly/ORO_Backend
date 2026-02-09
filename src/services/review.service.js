import * as reviewRepo from "../repos/review.repo.js";
import ApiError from "../utils/ApiError.js";
import {
  reviewFilters,
  reviewSort,
  reviewPagination
} from "../utils/filter_sort_pagination.js";

/* =========================
   CREATE
========================= */
export const create = async (data) => {
  return await reviewRepo.create(data);
};

/* =========================
   FIND BY ID
========================= */
export const findById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Review Id / رقم التقييم غير صالح");
  }

  const review = await reviewRepo.findById(id);
  if (!review) {
    throw ApiError.notFound("Review not found / التقييم غير موجود");
  }

  return review;
};

/* =========================
   FIND BY PRODUCT
========================= */
export const findByProduct = async (productId, query = {}) => {
  if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Product Id / رقم المنتج غير صالح");
  }

  const pagination = reviewPagination(query);

  const { reviews, total } = await reviewRepo.findByProduct(
    productId,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { reviews, total, pages };
};

/* =========================
   FIND ALL (ADMIN)
========================= */
export const findAll = async (query = {}) => {
  const filters = reviewFilters(query);
  const sort = reviewSort(query);
  const pagination = reviewPagination(query);

  const { reviews, total } = await reviewRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { reviews, total, pages };
};

/* =========================
   UPDATE
========================= */
export const update = async (id, newData) => {
  await findById(id);
  return await reviewRepo.update(id, newData);
};

/* =========================
   SOFT DELETE
========================= */
export const remove = async (id) => {
  await findById(id);
  return await reviewRepo.remove(id);
};

/* =========================
   HARD DELETE (OPTIONAL)
========================= */
export const hRemove = async (id) => {
  await findById(id);
  return await reviewRepo.hRemove(id);
};
