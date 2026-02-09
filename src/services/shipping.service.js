import * as shippingRepo from "../repos/shipping.repo.js";

export const create = async (data) => {
  return await shippingRepo.create(data);
};

export const findById = async (id) => {
  return await shippingRepo.findById(id);
};

export const findByOrder = async (orderId) => {
  return await shippingRepo.findByOrder(orderId);
};

export const findAll = async (filters, sort, pagination) => {
  const { shippings, total } = await shippingRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / pagination.limit);
  return { shippings, total, pages };
};

export const update = async (id, data) => {
  return await shippingRepo.update(id, data);
};

export const remove = async (id) => {
  return await shippingRepo.remove(id);
};
