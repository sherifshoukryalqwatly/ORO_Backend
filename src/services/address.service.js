import * as addressRepo from '../repos/address.repo.js';
import ApiError from '../utils/ApiError.js';
import { addressFilters, addressSort, addressPagination } from '../utils/filter_sort_pagination.js';

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ==========================
// Create Address
// ==========================
export const create = async (data) => {
  if (!data.user || !isValidObjectId(data.user)) {
    throw ApiError.badRequest('Invalid User Id / معرف المستخدم غير صحيح');
  }

  const address = await addressRepo.create(data);
  return address;
};

// ==========================
// Find Address By Id
// ==========================
export const findById = async (id) => {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid Address Id / معرف العنوان غير صحيح');
  }

  const address = await addressRepo.findById(id);
  if (!address) {
    throw ApiError.notFound('Address Not Found / العنوان غير موجود');
  }

  return address;
};

// ==========================
// Find All Addresses
// ==========================
export const findAll = async (query = {}) => {
  const filters = addressFilters(query);
  const sort = addressSort(query);
  const pagination = addressPagination(query);

  const { addresses, total } = await addressRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { addresses, total, pages };
};

// ==========================
// Update Address
// ==========================
export const update = async (id, newData) => {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid Address Id / معرف العنوان غير صحيح');
  }

  const address = await addressRepo.findById(id);
  if (!address) {
    throw ApiError.notFound('Address Not Found / العنوان غير موجود');
  }

  return await addressRepo.update(id, newData);
};

// ==========================
// Hard Delete Address
// ==========================
export const hRemove = async (id) => {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid Address Id / معرف العنوان غير صحيح');
  }

  const address = await addressRepo.findById(id);
  if (!address) {
    throw ApiError.notFound('Address Not Found / العنوان غير موجود');
  }

  await addressRepo.hRemove(id);
  return { message: 'Address deleted successfully / تم حذف العنوان بنجاح' };
};

// ==========================
// Soft Delete Address
// ==========================
export const remove = async (id) => {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid Address Id / معرف العنوان غير صحيح');
  }

  const address = await addressRepo.findById(id);
  if (!address) {
    throw ApiError.notFound('Address Not Found / العنوان غير موجود');
  }

  await addressRepo.remove(id);
  return { message: 'Address deleted successfully / تم حذف العنوان بنجاح' };
};

// ==========================
// Hard Delete Multiple Addresses
// ==========================
export const hRemoveAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs Array is Required / مصفوفة من المعرفات مطلوبة');
  }

  const objIds = ids.filter((id) => isValidObjectId(id));
  const result = await addressRepo.hRemoveAll(objIds);

  return {
    message: `${result.deletedCount} Addresses Deleted Successfully / تم حذف العناوين بنجاح`,
  };
};

// ==========================
// Soft Delete Multiple Addresses
// ==========================
export const removeAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs Array is Required / مصفوفة من المعرفات مطلوبة');
  }

  const objIds = ids.filter((id) => isValidObjectId(id));
  const result = await addressRepo.removeAll(objIds);

  return {
    message: `${result.deletedCount} Addresses Deleted Successfully / تم حذف العناوين بنجاح`,
  };
};

// ==========================
// Find Addresses By User
// ==========================
export const findByUser = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw ApiError.badRequest('Invalid User Id / معرف المستخدم غير صحيح');
  }

  const addresses = await addressRepo.findByUser(userId);
  return addresses;
};
