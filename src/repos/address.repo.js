import Address from '../models/address.model.js';

// ==========================
// CREATE
// ==========================
export const create = async (data) => {
  const address = new Address(data);
  return await address.save();
};

// ==========================
// FIND BY ID
// ==========================
export const findById = async (id) => {
  return await Address.findOne({ _id: id});
};

// ==========================
// FIND BY USER
// ==========================
export const findByUser = async (userId) => {
  return await Address.find({
    user: userId,
    isDeleted: { $ne: true },
  }).sort({ isDefault: -1, createdAt: -1 });
};

// ==========================
// FIND ALL
// ==========================
export const findAll = async (filters, sort, pagination) => {
  const finalFilters = { ...filters, isDeleted: { $ne: true } };

  const [addresses, total] = await Promise.all([
    Address.find(finalFilters)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.skip),
    Address.countDocuments(finalFilters),
  ]);

  return { addresses, total };
};

// ==========================
// UPDATE
// ==========================
export const update = async (id, newData) => {
  return await Address.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    newData,
    { new: true, runValidators: true }
  );
};

// ==========================
// HARD DELETE
// ==========================
export const hRemove = async (id) => {
  return await Address.findByIdAndDelete(id);
};

// ==========================
// SOFT DELETE
// ==========================
export const remove = async (id) => {
  return await Address.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

// ==========================
// HARD DELETE ALL
// ==========================
export const hRemoveAll = async (ids) => {
  return await Address.deleteMany({ _id: { $in: ids } });
};

// ==========================
// SOFT DELETE ALL
// ==========================
export const removeAll = async (ids) => {
  return await Address.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } },
    { runValidators: true }
  );
};
