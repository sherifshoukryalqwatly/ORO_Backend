import * as categoryRepo from '../repos/categories.repo.js';
import ApiError from '../utils/ApiError.js';

/* ----------------------------- HELPERS ----------------------------- */
const validateObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

/* ----------------------------- CREATE CATEGORY ----------------------------- */
export const create = async (data) => {
  return await categoryRepo.create(data);
};

/* ----------------------------- GET CATEGORY ----------------------------- */
export const findById = async (id) => {
  if (!validateObjectId(id)) {
    throw ApiError.badRequest('Invalid Category Id / رقم التصنيف غير صحيح');
  }

  const category = await categoryRepo.findById(id);

  if (!category) throw ApiError.notFound('Category not found / التصنيف غير موجود');

  return category;
};

export const findBySlug = async (slug, lang = 'en') => {
  const category = await categoryRepo.findBySlug(slug, lang);

  if (!category) throw ApiError.notFound('Category not found / التصنيف غير موجود');

  return category;
};

/* ----------------------------- GET ALL ----------------------------- */
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  return await categoryRepo.findAll(filters, sort, pagination);
};

/* ----------------------------- UPDATE CATEGORY ----------------------------- */
export const update = async (id, newData) => {
  if (!validateObjectId(id)) {
    throw ApiError.badRequest('Invalid Category Id / رقم التصنيف غير صحيح');
  }

  const category = await categoryRepo.findById(id);
  if (!category) throw ApiError.notFound('Category not found / التصنيف غير موجود');

  return await categoryRepo.update(id, newData);
};

/* ----------------------------- DELETE CATEGORY ----------------------------- */
export const remove = async (id) => {
  if (!validateObjectId(id)) {
    throw ApiError.badRequest('Invalid Category Id / رقم التصنيف غير صحيح');
  }

  const category = await categoryRepo.findById(id);
  if (!category) throw ApiError.notFound('Category not found / التصنيف غير موجود');

  return await categoryRepo.remove(id);
};

export const hRemove = async (id) => {
  if (!validateObjectId(id)) {
    throw ApiError.badRequest('Invalid Category Id / رقم التصنيف غير صحيح');
  }

  const category = await categoryRepo.findById(id);
  if (!category) throw ApiError.notFound('Category not found / التصنيف غير موجود');

  return await categoryRepo.hRemove(id);
};

/* ----------------------------- BULK DELETE ----------------------------- */
export const removeAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs array is required / مصفوفة من الأرقام المميزة مطلوبة');
  }

  return await categoryRepo.removeAll(ids);
};

export const hRemoveAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs array is required / مصفوفة من الأرقام المميزة مطلوبة');
  }

  return await categoryRepo.hRemoveAll(ids);
};
