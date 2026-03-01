import * as refundRepo from "../repos/refund.repo.js";
import ApiError from "../utils/ApiError.js";
import {
  refundFilters,
  refundSort,
  refundPagination
} from "../utils/filter_sort_pagination.js";

/* =========================
   CREATE
========================= */
export const create = async (data) => {
  return await refundRepo.create(data);
};

/* =========================
   FIND BY ID
========================= */
export const findById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Refund Id / رقم الاسترجاع غير صالح");
  }

  const refund = await refundRepo.findById(id);
  if (!refund) {
    throw ApiError.notFound("Refund not found / طلب الاسترجاع غير موجود");
  }

  return refund;
};

/* =========================
   FIND ALL (ADMIN)
========================= */
export const findAll = async (query = {}) => {
  const filters = refundFilters(query);
  const sort = refundSort(query);
  const pagination = refundPagination(query);

  const { refunds, total } = await refundRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { refunds, total, pages };
};

/* =========================
   UPDATE STATUS (ADMIN)
========================= */
export const updateStatus = async (id, data) => {
  await findById(id);

  // optional business rule
  if (data.status && !["pending", "approved", "rejected"].includes(data.status)) {
    throw ApiError.badRequest("Invalid refund status / حالة استرجاع غير صحيحة");
  }

  return await refundRepo.update(id, data);
};

/* =========================
   SOFT DELETE
========================= */
export const remove = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Refund Id / رقم الاسترجاع غير صالح");
  }

  const refund = await refundRepo.findById(id);

  if (!refund) {
    throw ApiError.notFound("Refund not found / طلب الاسترجاع غير موجود");
  }
  return await refundRepo.remove(id);
};

/* =========================
   HARD DELETE (OPTIONAL)
========================= */
export const hRemove = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Refund Id / رقم الاسترجاع غير صالح");
  }

  const refund = await refundRepo.findById(id);

  if (!refund) {
    throw ApiError.notFound("Refund not found / طلب الاسترجاع غير موجود");
  }

  return await refundRepo.hRemove(id);
};
