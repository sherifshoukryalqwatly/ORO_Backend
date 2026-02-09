import * as shippingRepo from "../repos/shipping.repo.js";
import ApiError from "../utils/ApiError.js";
import {
  shippingFilters,
  shippingSort,
  shippingPagination
} from "../utils/filter_sort_pagination.js";

/* =========================
   CREATE
========================= */
export const create = async (data) => {
  return await shippingRepo.create(data);
};

/* =========================
   FIND BY ID
========================= */
export const findById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Shipping Id / رقم الشحن غير صالح");
  }

  const shipping = await shippingRepo.findById(id);
  if (!shipping) {
    throw ApiError.notFound("Shipping not found / عملية الشحن غير موجودة");
  }

  return shipping;
};

/* =========================
   FIND BY ORDER
========================= */
export const findByOrder = async (orderId) => {
  if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Order Id / رقم الطلب غير صالح");
  }

  const shipping = await shippingRepo.findByOrder(orderId);
  if (!shipping) {
    throw ApiError.notFound("Shipping for this order not found / الشحن لهذا الطلب غير موجود");
  }

  return shipping;
};

/* =========================
   FIND ALL (ADMIN)
========================= */
export const findAll = async (query = {}) => {
  const filters = shippingFilters(query);
  const sort = shippingSort(query);
  const pagination = shippingPagination(query);

  const { shippings, total } = await shippingRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { shippings, total, pages };
};

/* =========================
   UPDATE
========================= */
export const update = async (id, newData) => {
  await findById(id);
  return await shippingRepo.update(id, newData);
};

/* =========================
   SOFT DELETE
========================= */
export const remove = async (id) => {
  await findById(id);
  return await shippingRepo.remove(id);
};

/* =========================
   HARD DELETE (OPTIONAL)
========================= */
export const hRemove = async (id) => {
  await findById(id);
  return await shippingRepo.hRemove(id);
};

/* =========================
   BULK SOFT DELETE (OPTIONAL)
========================= */
export const removeAll = async (ids) => {
  return await shippingRepo.removeAll(ids);
};

/* =========================
   BULK HARD DELETE (OPTIONAL)
========================= */
export const hRemoveAll = async (ids) => {
  return await shippingRepo.hRemoveAll(ids);
};
