import * as orderRepo from "../repos/order.repo.js";
import ApiError from "../utils/ApiError.js";
import { orderFilters, orderSort, orderPagination } from "../utils/filter_sort_pagination.js";
// CREATE
export const create = async (data) => {
  return await orderRepo.create(data);
};

// FIND BY ID
export const findById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest("Invalid Order Id / Id غير صالح");
  }

  const order = await orderRepo.findById(id);
  if (!order) {
    throw ApiError.notFound("Order not found / الطلب غير موجود");
  }

  return order;
};

// FIND BY USER
export const findByUser = async (userId, query = {}) => {
  const filters = orderFilters(query);
  const sort = orderSort(query);
  const pagination = orderPagination(query);

  const { orders, total } = await orderRepo.findByUser(userId, filters, sort, pagination);
  const pages = Math.ceil(total / (pagination.limit || total));

  return { orders, total, pages };
};

// FIND ALL
export const findAll = async (query = {}) => {
  const filters = orderFilters(query);
  const sort = orderSort(query);
  const pagination = orderPagination(query);

  const { orders, total } = await orderRepo.findAll(filters, sort, pagination);
  const pages = Math.ceil(total / (pagination.limit || total));

  return { orders, total, pages };
};

// UPDATE
export const update = async (id, newData) => {
  await findById(id);
  return await orderRepo.update(id, newData);
};

// SOFT DELETE
export const remove = async (id) => {
  await findById(id);
  return await orderRepo.remove(id);
};

// HARD DELETE
export const hRemove = async (id) => {
  await findById(id);
  return await orderRepo.hRemove(id);
};

// BULK SOFT DELETE
export const removeAll = async (ids) => {
  return await orderRepo.removeAll(ids);
};

// BULK HARD DELETE
export const hRemoveAll = async (ids) => {
  return await orderRepo.hRemoveAll(ids);
};
