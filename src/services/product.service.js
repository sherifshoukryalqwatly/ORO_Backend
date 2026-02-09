import * as productRepo from "../repos/product.repo.js";

export const create = async (data) => {
  return await productRepo.create(data);
};

export const findById = async (id) => {
  return await productRepo.findById(id);
};

export const findAll = async (filters, sort, pagination) => {
  const { products, total } = await productRepo.findAll(
    filters,
    sort,
    pagination
  );
  const pages = Math.ceil(total / pagination.limit);
  return { products, total, pages };
};

export const update = async (id, data) => {
  return await productRepo.update(id, data);
};

export const remove = async (id) => {
  return await productRepo.remove(id);
};

export const hRemove = async (id) => {
  return await productRepo.hRemove(id);
};
