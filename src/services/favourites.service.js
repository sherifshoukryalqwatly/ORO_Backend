import * as favouriteRepo from '../repos/favourites.repo.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/* ----------------------------- CREATE OR GET ----------------------------- */
export const createOrGet = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');
  }

  const favourite = await favouriteRepo.createOrGet({ user: userId });
  return favourite;
};

/* ----------------------------- FIND BY ID ----------------------------- */
export const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid Favourite Id / Id المفضل خطأ');
  }

  const favourite = await favouriteRepo.findById(id);
  if (!favourite) throw ApiError.notFound('Favourite Not Found / قائمة المفضلات غير موجودة');
  return favourite;
};

/* ----------------------------- FIND BY USER ----------------------------- */
export const findByUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');
  }

  const favourite = await favouriteRepo.findByUser(userId);
  if (!favourite) throw ApiError.notFound('Favourite Not Found / قائمة المفضلات غير موجودة');
  return favourite;
};

/* ----------------------------- FIND ALL ----------------------------- */
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const { favourites, total } = await favouriteRepo.findAll(filters, sort, pagination);
  return { favourites, total };
};

/* ----------------------------- UPDATE ----------------------------- */
export const update = async (id, products) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid Favourite Id / Id المفضل خطأ');
  }

  if (!Array.isArray(products)) {
    throw ApiError.badRequest('Products must be an array / يجب أن تكون المنتجات مصفوفة');
  }

  const favourite = await favouriteRepo.update(id, { products });
  if (!favourite) throw ApiError.notFound('Favourite Not Found / قائمة المفضلات غير موجودة');
  return favourite;
};

/* ----------------------------- SOFT DELETE ----------------------------- */
export const remove = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid Favourite Id / Id المفضل خطأ');
  }

  const favourite = await favouriteRepo.remove(id);
  if (!favourite) throw ApiError.notFound('Favourite Not Found / قائمة المفضلات غير موجودة');
  return favourite;
};

/* ----------------------------- HARD DELETE ----------------------------- */
export const hRemove = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid Favourite Id / Id المفضل خطأ');
  }

  return await favouriteRepo.hRemove(id);
};

/* ----------------------------- BULK SOFT DELETE ----------------------------- */
export const removeAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs Array is Required / مصفوفة Ids مطلوبة');
  }

  const objIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
  return await favouriteRepo.removeAll(objIds);
};

/* ----------------------------- BULK HARD DELETE ----------------------------- */
export const hRemoveAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs Array is Required / مصفوفة Ids مطلوبة');
  }

  const objIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
  return await favouriteRepo.hRemoveAll(objIds);
};
