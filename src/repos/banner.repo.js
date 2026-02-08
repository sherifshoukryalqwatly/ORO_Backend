import Banner from '../models/banner.model.js';

/* =========================
   CREATE
========================= */
export const create = async (data) => {
  const banner = new Banner(data);
  return await banner.save();
};

/* =========================
   FIND BY ID
========================= */
export const findById = async (id) => {
  return await Banner.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

/* =========================
   FIND ALL (ADMIN / DASHBOARD)
========================= */
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const finalFilters = {
    ...filters,
    isDeleted: { $ne: true },
  };

  const [banners, total] = await Promise.all([
    Banner.find(finalFilters)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.skip),
    Banner.countDocuments(finalFilters),
  ]);

  return { banners, total };
};

/* =========================
   FIND ACTIVE (PUBLIC – HOME PAGE)
========================= */
export const findActive = async () => {
  return await Banner.find({
    isActive: true,
    isDeleted: false,
  }).sort({ displayOrder: 1, createdAt: -1 });
};

/* =========================
   UPDATE
========================= */
export const update = async (id, newData) => {
  return await Banner.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    newData,
    { new: true, runValidators: true }
  );
};

/* =========================
   HARD DELETE
========================= */
export const hRemove = async (id) => {
  return await Banner.findByIdAndDelete(id);
};

/* =========================
   SOFT DELETE
========================= */
export const remove = async (id) => {
  return await Banner.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};

/* =========================
   HARD DELETE ALL
========================= */
export const hRemoveAll = async (ids) => {
  return await Banner.deleteMany({ _id: { $in: ids } });
};

/* =========================
   SOFT DELETE ALL
========================= */
export const removeAll = async (ids) => {
  return await Banner.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { runValidators: true }
  );
};
