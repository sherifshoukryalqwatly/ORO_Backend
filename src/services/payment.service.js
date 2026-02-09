import * as paymentRepo from "../repos/payment.repo.js";
import ApiError from "../utils/ApiError.js";
import {
  paymentFilters,
  paymentSort,
  paymentPagination
} from "../utils/filter_sort_pagination.js";

/* =========================
   CREATE
========================= */
export const create = async (data) => {
  return await paymentRepo.create(data);
};

/* =========================
   FIND BY ID
========================= */
export const findById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Payment Id / رقم دفع غير صالح");
  }

  const payment = await paymentRepo.findById(id);
  if (!payment) {
    throw ApiError.notFound("Payment not found / عملية الدفع غير موجودة");
  }

  return payment;
};

/* =========================
   FIND BY USER
========================= */
export const findByUser = async (userId, query = {}) => {
  const filters = paymentFilters(query);
  const sort = paymentSort(query);
  const pagination = paymentPagination(query);

  const { payments, total } = await paymentRepo.findByUser(
    userId,
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { payments, total, pages };
};

/* =========================
   FIND ALL (ADMIN)
========================= */
export const findAll = async (query = {}) => {
  const filters = paymentFilters(query);
  const sort = paymentSort(query);
  const pagination = paymentPagination(query);

  const { payments, total } = await paymentRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { payments, total, pages };
};

/* =========================
   UPDATE
========================= */
export const update = async (id, newData) => {
  await findById(id);
  return await paymentRepo.update(id, newData);
};

/* =========================
   SOFT DELETE
========================= */
export const remove = async (id) => {
  await findById(id);
  return await paymentRepo.remove(id);
};

/* =========================
   HARD DELETE
========================= */
export const hRemove = async (id) => {
  await findById(id);
  return await paymentRepo.hRemove(id);
};

/* =========================
   BULK SOFT DELETE
========================= */
export const removeAll = async (ids) => {
  return await paymentRepo.removeAll(ids);
};

/* =========================
   BULK HARD DELETE
========================= */
export const hRemoveAll = async (ids) => {
  return await paymentRepo.hRemoveAll(ids);
};
