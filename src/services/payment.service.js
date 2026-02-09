import * as paymentRepo from "../repos/payment.repo.js";

export const create = async (data) => {
  return await paymentRepo.create(data);
};

export const findById = async (id) => {
  return await paymentRepo.findById(id);
};

export const findAll = async (filters, sort, pagination) => {
  const { payments, total } = await paymentRepo.findAll(filters, sort, pagination);
  const pages = Math.ceil(total / pagination.limit);
  return { payments, total, pages };
};

export const findByUser = async (userId, filters, sort, pagination) => {
  const { payments, total } = await paymentRepo.findByUser(
    userId,
    filters,
    sort,
    pagination
  );
  const pages = Math.ceil(total / pagination.limit);
  return { payments, total, pages };
};

export const update = async (id, data) => {
  return await paymentRepo.update(id, data);
};

export const remove = async (id) => {
  return await paymentRepo.remove(id);
};

export const hRemove = async (id) => {
  return await paymentRepo.hRemove(id);
};
