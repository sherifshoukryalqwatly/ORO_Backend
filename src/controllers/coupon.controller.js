import * as couponService from '../services/coupon.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';
import { auditLogService } from '../services/auditlog.service.js';

/* ----------------------------- HELPER LOG ACTION ----------------------------- */
const logAction = async ({ req, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: req.user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
};

/* ----------------------------- CREATE ----------------------------- */
export const create = asyncWrapper(async (req, res) => {
  const coupon = await couponService.create(req.body);

  await logAction({
    req,
    action: 'CREATE',
    targetModel: 'Coupon',
    targetId: coupon._id,
    description: `Created new coupon ${coupon.code}`
  });

  return appResponses.success(res, coupon, 'Coupon Created Successfully / تم إنشاء الكوبون بنجاح', 201);
});

/* ----------------------------- GET BY ID ----------------------------- */
export const findById = asyncWrapper(async (req, res) => {
  const coupon = await couponService.findById(req.params.id);

  await logAction({
    req,
    action: 'READ',
    targetModel: 'Coupon',
    targetId: coupon._id,
    description: 'Fetched coupon by ID'
  });

  return appResponses.success(res, coupon, 'Coupon Retrieved Successfully / تم استرجاع الكوبون بنجاح');
});

/* ----------------------------- GET BY CODE ----------------------------- */
export const findByCode = asyncWrapper(async (req, res) => {
  const coupon = await couponService.findByCode(req.params.code);

  await logAction({
    req,
    action: 'READ',
    targetModel: 'Coupon',
    targetId: coupon._id,
    description: `Fetched coupon by code: ${req.params.code}`
  });

  return appResponses.success(res, coupon, 'Coupon Retrieved Successfully / تم استرجاع الكوبون بنجاح');
});

/* ----------------------------- GET ALL ----------------------------- */
export const findAll = asyncWrapper(async (req, res) => {
  const { coupons, total } = await couponService.findAll(req.query.filters || {}, req.query.sort || {}, req.query.pagination || {});

  const pages = Math.ceil(total / ((req.query.pagination?.limit) || total));

  await logAction({
    req,
    action: 'READ',
    targetModel: 'Coupon',
    description: `Fetched all coupons (count: ${coupons.length})`
  });

  return appResponses.success(res, { data: coupons, total, pages }, 'Coupons Retrieved Successfully / تم استرجاع الكوبونات بنجاح');
});

/* ----------------------------- UPDATE ----------------------------- */
export const update = asyncWrapper(async (req, res) => {
  const updatedCoupon = await couponService.update(req.params.id, req.body);

  await logAction({
    req,
    action: 'UPDATE',
    targetModel: 'Coupon',
    targetId: updatedCoupon._id,
    description: `Updated coupon ${updatedCoupon.code}`
  });

  return appResponses.success(res, updatedCoupon, 'Coupon Updated Successfully / تم تعديل الكوبون بنجاح');
});

/* ----------------------------- SOFT DELETE ----------------------------- */
export const remove = asyncWrapper(async (req, res) => {
  await couponService.remove(req.params.id);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Coupon',
    targetId: req.params.id,
    description: 'Soft deleted coupon'
  });

  return appResponses.success(res, null, 'Coupon Deleted Successfully / تم حذف الكوبون بنجاح');
});

/* ----------------------------- HARD DELETE ----------------------------- */
export const hRemove = asyncWrapper(async (req, res) => {
  await couponService.hRemove(req.params.id);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Coupon',
    targetId: req.params.id,
    description: 'Hard deleted coupon'
  });

  return appResponses.success(res, null, 'Coupon Hard Deleted Successfully / تم حذف الكوبون نهائياً');
});

/* ----------------------------- BULK DELETE ----------------------------- */
export const removeAll = asyncWrapper(async (req, res) => {
  await couponService.removeAll(req.body.ids);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Coupon',
    description: `Soft deleted multiple coupons: ${req.body.ids.join(', ')}`
  });

  return appResponses.success(res, null, 'Coupons Deleted Successfully / تم حذف الكوبونات بنجاح');
});

export const hRemoveAll = asyncWrapper(async (req, res) => {
  await couponService.hRemoveAll(req.body.ids);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Coupon',
    description: `Hard deleted multiple coupons: ${req.body.ids.join(', ')}`
  });

  return appResponses.success(res, null, 'Coupons Hard Deleted Successfully / تم حذف الكوبونات نهائياً');
});
