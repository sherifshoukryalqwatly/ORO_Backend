import * as reviewRepo from "../repos/review.repo.js";

export const create = async (data) => {
  return await reviewRepo.create(data);
};

export const findById = async (id) => {
  return await reviewRepo.findById(id);
};

export const findByProduct = async (productId, pagination) => {
  const { reviews, total } = await reviewRepo.findByProduct(
    productId,
    pagination
  );

  const pages = Math.ceil(total / pagination.limit);
  return { reviews, total, pages };
};

export const findAll = async (filters, sort, pagination) => {
  const { reviews, total } = await reviewRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / pagination.limit);
  return { reviews, total, pages };
};

export const update = async (id, data) => {
  return await reviewRepo.update(id, data);
};

export const remove = async (id) => {
  return await reviewRepo.remove(id);
};
