import * as favouriteRepo from '../repos/favourites.repo.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';


/* ==============================
   GET USER FAVOURITES
============================== */
export const getUserFavourites = async (userId) => {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');
  }

  const favourite = await favouriteRepo.getUserFavourites(userId);

  // لو مش موجودة نرجع array فاضية بدل error
  if (!favourite) {
    return { user: userId, products: [] };
  }

  return favourite;
};


/* ==============================
   ADD PRODUCT
============================== */
export const addProduct = async (userId, productId) => {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw ApiError.badRequest('Invalid Product Id / Id المنتج خطأ');
  }

  const favourite = await favouriteRepo.addProduct(userId, productId);

  return favourite;
};


/* ==============================
   REMOVE PRODUCT
============================== */
export const removeProduct = async (userId, productId) => {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw ApiError.badRequest('Invalid Product Id / Id المنتج خطأ');
  }

  const favourite = await favouriteRepo.removeProduct(userId, productId);

  // لو مفيش document أصلاً
  if (!favourite) {
    throw ApiError.notFound('Favourite Not Found / قائمة المفضلات غير موجودة');
  }

  return favourite;
};
