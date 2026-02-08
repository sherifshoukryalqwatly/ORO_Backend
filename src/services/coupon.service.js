import * as couponRepo from '../repos/coupon.repo.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/* ----------------------------- HELPERS ----------------------------- */
const validateObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

/* ----------------------------- CREATE COUPON ----------------------------- */
export const create = async (data) => {
  // Check if coupon code already exists
  if (data.code) {
    const existing = await couponRepo.findByCode(data.code);
    if (existing) {
      throw ApiError.conflict('Coupon code already exists / كود الكوبون موجود مسبقاً');
    }
  }

  return await couponRepo.create(data);
};

/* ----------------------------- GET COUPON ----------------------------- */
export const findById = async (id) => {
  if (!validateObjectId(id)) {
    throw ApiError.badRequest('Invalid Coupon Id / رقم الكوبون غير صحيح');
  }

  const coupon = await couponRepo.findById(id);
  if (!coupon) throw ApiError.notFound('Coupon not found / الكوبون غير موجود');

  return coupon;
};

export const findByCode = async (code) => {
  if (!code) throw ApiError.badRequest('Coupon code is required / كود الكوبون مطلوب');

  const coupon = await couponRepo.findByCode(code);
  if (!coupon) throw ApiError.notFound('Coupon not found / الكوبون غير موجود');

  return coupon;
};

/* ----------------------------- GET ALL ----------------------------- */
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  return await couponRepo.findAll(filters, sort, pagination);
};

/* ----------------------------- UPDATE COUPON ----------------------------- */
export const update = async (id, newData) => {
  if (!validateObjectId(id)) {
    throw ApiError.badRequest('Invalid Coupon Id / رقم الكوبون غير صحيح');
  }

  const coupon = await couponRepo.findById(id);
  if (!coupon) throw ApiError.notFound('Coupon not found / الكوبون غير موجود');

  // Check if updating code to an existing one
  if (newData.code && newData.code !== coupon.code) {
    const exist = await couponRepo.findByCode(newData.code);
    if (exist) {
      throw ApiError.conflict('Coupon code already exists / كود الكوبون موجود مسبقاً');
    }
  }

  return await couponRepo.update(id, newData);
};

/* ----------------------------- DELETE COUPON ----------------------------- */
export const remove = async (id) => {
  if (!validateObjectId(id)) throw ApiError.badRequest('Invalid Coupon Id / رقم الكوبون غير صحيح');

  const coupon = await couponRepo.findById(id);
  if (!coupon) throw ApiError.notFound('Coupon not found / الكوبون غير موجود');

  return await couponRepo.remove(id);
};

export const hRemove = async (id) => {
  if (!validateObjectId(id)) throw ApiError.badRequest('Invalid Coupon Id / رقم الكوبون غير صحيح');

  const coupon = await couponRepo.findById(id);
  if (!coupon) throw ApiError.notFound('Coupon not found / الكوبون غير موجود');

  return await couponRepo.hRemove(id);
};

/* ----------------------------- BULK DELETE ----------------------------- */
export const removeAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs array is required / مصفوفة من الأرقام المميزة مطلوبة');
  }

  return await couponRepo.removeAll(ids);
};

export const hRemoveAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs array is required / مصفوفة من الأرقام المميزة مطلوبة');
  }

  return await couponRepo.hRemoveAll(ids);
};
