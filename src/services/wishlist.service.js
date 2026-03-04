import * as wishlistRepo from '../repos/wishlist.repo.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';


/* ==============================
   GET USER WISHLIST
============================== */
export const getUserWishlist = async (userId) => {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');
  }

  const wishlist = await wishlistRepo.getUserWishlist(userId);

  // If not found → return empty list
  if (!wishlist) {
    return { user: userId, items: [] };
  }

  return wishlist;
};


/* ==============================
   ADD ITEM
============================== */
export const addItem = async (userId, productId, variantId = null) => {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw ApiError.badRequest('Invalid Product Id / Id المنتج خطأ');
  }

  if (variantId && !mongoose.Types.ObjectId.isValid(variantId)) {
    throw ApiError.badRequest('Invalid Variant Id / Id المتغير خطأ');
  }

  const wishlist = await wishlistRepo.addItem(userId, productId, variantId);

  return wishlist;
};


/* ==============================
   REMOVE ITEM
============================== */
export const removeItem = async (userId, productId, variantId = null) => {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw ApiError.badRequest('Invalid Product Id / Id المنتج خطأ');
  }

  if (variantId && !mongoose.Types.ObjectId.isValid(variantId)) {
    throw ApiError.badRequest('Invalid Variant Id / Id المتغير خطأ');
  }

  const wishlist = await wishlistRepo.removeItem(userId, productId, variantId);

  if (!wishlist) {
    throw ApiError.notFound('Wishlist Not Found / قائمة الأمنيات غير موجودة');
  }

  return wishlist;
};