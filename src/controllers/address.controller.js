import * as addressService from '../services/address.service.js';
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
// CREATE ADDRESS
// ==========================
export const create = asyncWrapper(async (req, res) => {
  const address = await addressService.create({
    ...req.body,
    user: req.user.id,
  });

  await logAction({
    req,
    action: 'CREATE',
    targetModel: 'Address',
    targetId: address._id,
    description: 'Created new address',
  });

  return appResponses.success(
    res,
    address,
    'Address Created Successfully / تم إنشاء العنوان بنجاح',
    201
  );
});

// ==========================
// FIND ADDRESS BY ID
// ==========================
export const findById = asyncWrapper(async (req, res) => {
  const address = await addressService.findById(req.params.id);

  await logAction({
    req,
    action: 'READ',
    targetModel: 'Address',
    targetId: req.params.id,
    description: 'Fetched address by ID',
  });

  return appResponses.success(
    res,
    address,
    'Address Retrieved Successfully / تم استرداد العنوان بنجاح'
  );
});

// ==========================
// FIND ALL ADDRESSES
// ==========================
export const findAll = asyncWrapper(async (req, res) => {
  const { addresses, total, pages } = await addressService.findAll(req.query);

  await logAction({
    req,
    action: 'READ',
    targetModel: 'Address',
    description: `Fetched all addresses (count: ${addresses.length})`,
  });

  return appResponses.success(
    res,
    { data: addresses, total, pages },
    'Addresses Retrieved Successfully / تم استرداد العناوين بنجاح'
  );
});

// ==========================
// FIND ADDRESSES BY USER (ME)
// ==========================
export const findMyAddresses = asyncWrapper(async (req, res) => {
  const addresses = await addressService.findByUser(req.user.id);

  await logAction({
    req,
    action: 'READ',
    targetModel: 'Address',
    description: 'Fetched own addresses',
  });

  return appResponses.success(
    res,
    addresses,
    'Addresses Retrieved Successfully / تم استرداد العناوين بنجاح'
  );
});

// ==========================
// UPDATE ADDRESS
// ==========================
export const update = asyncWrapper(async (req, res) => {
  const updatedAddress = await addressService.update(req.params.id, req.body);

  await logAction({
    req,
    action: 'UPDATE',
    targetModel: 'Address',
    targetId: updatedAddress._id,
    description: 'Updated address',
  });

  return appResponses.success(
    res,
    updatedAddress,
    'Address Updated Successfully / تم تعديل العنوان بنجاح'
  );
});

// ==========================
// HARD DELETE ADDRESS
// ==========================
export const hRemove = asyncWrapper(async (req, res) => {
  await addressService.hRemove(req.params.id);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Address',
    targetId: req.params.id,
    description: 'Hard deleted address',
  });

  return appResponses.success(
    res,
    null,
    'Address Deleted Successfully / تم حذف العنوان بنجاح'
  );
});

// ==========================
// SOFT DELETE ADDRESS
// ==========================
export const remove = asyncWrapper(async (req, res) => {
  await addressService.remove(req.params.id);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Address',
    targetId: req.params.id,
    description: 'Soft deleted address',
  });

  return appResponses.success(
    res,
    null,
    'Address Deleted Successfully / تم حذف العنوان بنجاح'
  );
});

// ==========================
// HARD DELETE MULTIPLE ADDRESSES
// ==========================
export const hRemoveAll = asyncWrapper(async (req, res) => {
  await addressService.hRemoveAll(req.body.ids);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Address',
    description: `Hard deleted multiple addresses: ${req.body.ids.join(', ')}`,
  });

  return appResponses.success(
    res,
    null,
    'Addresses Deleted Successfully / تم حذف العناوين بنجاح'
  );
});

// ==========================
// SOFT DELETE MULTIPLE ADDRESSES
// ==========================
export const removeAll = asyncWrapper(async (req, res) => {
  await addressService.removeAll(req.body.ids);

  await logAction({
    req,
    action: 'DELETE',
    targetModel: 'Address',
    description: `Soft deleted multiple addresses: ${req.body.ids.join(', ')}`,
  });

  return appResponses.success(
    res,
    null,
    'Addresses Deleted Successfully / تم حذف العناوين بنجاح'
  );
});