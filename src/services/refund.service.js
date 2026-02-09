import * as refundRepo from "../repos/refund.repo.js";

export const create = async (data) => {
  return await refundRepo.create(data);
};

export const findById = async (id) => {
  return await refundRepo.findById(id);
};

export const findAll = async (filters, sort, pagination) => {
  const { refunds, total } = await refundRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / pagination.limit);
  return { refunds, total, pages };
};

// ADMIN ACTION
export const updateStatus = async (id, data) => {
  return await refundRepo.update(id, data);
};

export const remove = async (id) => {
  return await refundRepo.remove(id);
};
