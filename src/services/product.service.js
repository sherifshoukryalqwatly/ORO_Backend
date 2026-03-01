import * as productRepo from "../repos/product.repo.js";
import ApiError from "../utils/ApiError.js";
import {
  productFilters,
  productSort,
  productPagination
} from "../utils/filter_sort_pagination.js";

/* =========================
   CREATE
========================= */
export const create = async (data) => {
  return await productRepo.create(data);
};

/* =========================
   FIND BY ID
========================= */
export const findById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Product Id / رقم المنتج غير صالح");
  }

  const product = await productRepo.findById(id);
  if (!product) {
    throw ApiError.notFound("Product not found / المنتج غير موجود");
  }

  return product;
};

/* =========================
   FIND ALL
========================= */
export const findAll = async (query = {}) => {
  const filters = productFilters(query);
  const sort = productSort(query);
  const pagination = productPagination(query);

  const { products, total } = await productRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { products, total, pages };
};

/* =========================
   UPDATE
========================= */
export const update = async (id, newData) => {
  await findById(id);
  return await productRepo.update(id, newData);
};

/* =========================
   SOFT DELETE
========================= */
export const remove = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Product Id / رقم المنتج غير صالح");
  }

  const product = await productRepo.findById(id);
  if (!product) {
    throw ApiError.notFound("Product not found / المنتج غير موجود");
  }

  return await productRepo.remove(id);
};

/* =========================
   HARD DELETE
========================= */
export const hRemove = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Product Id / رقم المنتج غير صالح");
  }

  const product = await productRepo.findById(id);
  if (!product) {
    throw ApiError.notFound("Product not found / المنتج غير موجود");
  }
  return await productRepo.hRemove(id);
};

/* =========================
   BULK SOFT DELETE
========================= */
export const removeAll = async (ids) => {
  return await productRepo.removeAll(ids);
};

/* =========================
   BULK HARD DELETE
========================= */
export const hRemoveAll = async (ids) => {
  return await productRepo.hRemoveAll(ids);
};
