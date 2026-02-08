import * as bannerRepo from '../repos/banner.repo.js';
import ApiError from '../utils/ApiError.js';
import {
  bannerFilters,
  bannerSort,
  bannerPagination,
} from '../utils/filter_sort_pagination.js';

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

/* =========================
   CREATE
========================= */
export const create = async (data) => {
  return await bannerRepo.create(data);
};

/* =========================
   FIND BY ID
========================= */
export const findById = async (id) => {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid Banner Id / معرف البنر غير صحيح');
  }

  const banner = await bannerRepo.findById(id);
  if (!banner) {
    throw ApiError.notFound('Banner Not Found / البنر غير موجود');
  }

  return banner;
};

/* =========================
   FIND ALL (ADMIN)
========================= */
export const findAll = async (query = {}) => {
  const filters = bannerFilters(query);
  const sort = bannerSort(query);
  const pagination = bannerPagination(query);

  const { banners, total } = await bannerRepo.findAll(
    filters,
    sort,
    pagination
  );

  const pages = Math.ceil(total / (pagination.limit || total));
  return { banners, total, pages };
};

/* =========================
   FIND ACTIVE (PUBLIC)
========================= */
export const findActive = async () => {
  return await bannerRepo.findActive();
};

/* =========================
   UPDATE
========================= */
export const update = async (id, newData) => {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid Banner Id / معرف البنر غير صحيح');
  }

  const banner = await bannerRepo.findById(id);
  if (!banner) {
    throw ApiError.notFound('Banner Not Found / البنر غير موجود');
  }

  return await bannerRepo.update(id, newData);
};

/* =========================
   HARD DELETE
========================= */
export const hRemove = async (id) => {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid Banner Id / معرف البنر غير صحيح');
  }

  const banner = await bannerRepo.findById(id);
  if (!banner) {
    throw ApiError.notFound('Banner Not Found / البنر غير موجود');
  }

  await bannerRepo.hRemove(id);
  return { message: 'Banner deleted successfully / تم حذف البنر بنجاح' };
};

/* =========================
   SOFT DELETE
========================= */
export const remove = async (id) => {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid Banner Id / معرف البنر غير صحيح');
  }

  const banner = await bannerRepo.findById(id);
  if (!banner) {
    throw ApiError.notFound('Banner Not Found / البنر غير موجود');
  }

  await bannerRepo.remove(id);
  return { message: 'Banner deleted successfully / تم حذف البنر بنجاح' };
};

/* =========================
   HARD DELETE ALL
========================= */
export const hRemoveAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs Array is Required / مصفوفة من المعرفات مطلوبة');
  }

  const validIds = ids.filter(isValidObjectId);
  await bannerRepo.hRemoveAll(validIds);

  return { message: 'Banners deleted successfully / تم حذف البنرات بنجاح' };
};

/* =========================
   SOFT DELETE ALL
========================= */
export const removeAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs Array is Required / مصفوفة من المعرفات مطلوبة');
  }

  const validIds = ids.filter(isValidObjectId);
  await bannerRepo.removeAll(validIds);

  return { message: 'Banners deleted successfully / تم حذف البنرات بنجاح' };
};
