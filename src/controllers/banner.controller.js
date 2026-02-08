import * as bannerService from '../services/banner.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';
import { auditLogService } from '../services/auditlog.service.js';

// Helper function to log actions
const logAction = async ({ req, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: req.user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });
};

// ==========================
// CREATE BANNER (ADMIN)
// ==========================
export const create = asyncWrapper(async (req, res) => {
  const banner = await bannerService.create(req.body);

  await logAction({
    req,
    action: 'CREATE',
    targetModel: 'Banner',
    targetId: banner._id,
    description: 'Created new banner',
  });

  return appResponses.success(
    res,
    banner,
    'Banner Created Successfully / تم إنشاء البنر بنجاح',
    201
  );
});

// ==========================
// FIND BANNER BY ID (ADMIN)
// ==========================
export const findById = asyncWrapper(async (req, res) => {
  const banner = await bannerService.findById(req.params.id);

  await logAction({
    req,
    action: 'READ',
    targetModel: 'Banner',
    targetId: req.params.id,
    description: 'Fetched banner by ID',
  });

  return appResponses.success(
    res,
    banner,
    'Banner Retrieved Successfully / تم استرداد البنر بنجاح'
  );
});

// ==========================
// FIND ALL BANNERS (ADMIN)
// ==========================
export const findAll = asyncWrapper(async (req, res) => {
  const { banners, total, pages } = await bannerService.findAll(req.query);

  await logAction({
    req,
    action: 'READ',
    targetModel: 'Banner',
    description: `Fetched all banners (count: ${banners.length})`,
  });

  return appResponses.success(
    res,
    { data: banners, total, pages },
    'Banners Retrieved Successfully / تم استرداد البنرات بنجاح'
  );
});

// ==========================
// FIND ACTIVE BANNERS (PUBLIC)
// ==========================
export const findActive = asyncWrapper(async (req, res) => {
  const banners = await bannerService.findActive();

  return appResponses.success(
    res,
    banners,
    'Active Banners Retrieved Successfully / تم استرداد البنرات النشطة بنجاح'
  );
});

// ==========================
// UPDATE BANNER (ADMIN)
// ==========================
export const update = asyncWrapper(async (req, res) => {
  const banner = await bannerService.update(req.params.id, req.body);

  await logAction({
    req,
    action: 'UPDATE',
    targetModel: 'Banner',
    targetId: banner._id,
    description: 'Updated banner',
  });

  return appResponses.success(
    res,
    banner,
    'Banner Updated Successfully / تم تعديل البنر بنجاح'
  );
});

// ==========================
// SOFT DELETE BANNER (ADMIN)
// ==========================
export const remove = asyncWrapper(async (req, res) => {
  await bannerService.remove(req.params.id);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Banner',
    targetId: req.params.id,
    description: 'Soft deleted banner',
  });

  return appResponses.success(
    res,
    null,
    'Banner Deleted Successfully / تم حذف البنر بنجاح'
  );
});

// ==========================
// HARD DELETE BANNER (ADMIN)
// ==========================
export const hRemove = asyncWrapper(async (req, res) => {
  await bannerService.hRemove(req.params.id);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Banner',
    targetId: req.params.id,
    description: 'Hard deleted banner',
  });

  return appResponses.success(
    res,
    null,
    'Banner Deleted Successfully / تم حذف البنر نهائيًا'
  );
});

// ==========================
// SOFT DELETE MULTIPLE BANNERS (ADMIN)
// ==========================
export const removeAll = asyncWrapper(async (req, res) => {
  await bannerService.removeAll(req.body.ids);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Banner',
    description: `Soft deleted multiple banners: ${req.body.ids.join(', ')}`,
  });

  return appResponses.success(
    res,
    null,
    'Banners Deleted Successfully / تم حذف البنرات بنجاح'
  );
});

// ==========================
// HARD DELETE MULTIPLE BANNERS (ADMIN)
// ==========================
export const hRemoveAll = asyncWrapper(async (req, res) => {
  await bannerService.hRemoveAll(req.body.ids);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Banner',
    description: `Hard deleted multiple banners: ${req.body.ids.join(', ')}`,
  });

  return appResponses.success(
    res,
    null,
    'Banners Deleted Successfully / تم حذف البنرات نهائيًا'
  );
});