import Coupon from '../models/coupon.model.js';

/* ----------------------------- CREATE ----------------------------- */
export const create = async (data) => {
  const coupon = new Coupon(data);
  return await coupon.save();
};

/* ----------------------------- FIND ----------------------------- */
export const findById = async (id) => {
  return await Coupon.findById(id);
};

export const findByCode = async (code) => {
  return await Coupon.findOne({ code: code.toUpperCase(), isDeleted: false });
};

/* ----------------------------- FIND ALL ----------------------------- */
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const [coupons, total] = await Promise.all([
    Coupon.find(filters)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.skip),
    Coupon.countDocuments(filters)
  ]);

  return { coupons, total };
};

/* ----------------------------- UPDATE ----------------------------- */
export const update = async (id, newData) => {
  return await Coupon.findByIdAndUpdate(id, newData, {
    new: true,
    runValidators: true
  });
};

/* ----------------------------- DELETE ----------------------------- */
// Hard delete
export const hRemove = async (id) => {
  return await Coupon.findByIdAndDelete(id);
};

// Soft delete
export const remove = async (id) => {
  return await Coupon.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

/* ----------------------------- DELETE MANY ----------------------------- */
// Hard delete all
export const hRemoveAll = async (ids) => {
  return await Coupon.deleteMany({ _id: { $in: ids } });
};

// Soft delete all
export const removeAll = async (ids) => {
  return await Coupon.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } },
    { runValidators: true }
  );
};
