import Cart from '../models/cart.model.js';

/* ----------------------------- CREATE ----------------------------- */
export const create = async (data) => {
  const cart = new Cart(data);
  return await cart.save();
};

/* ----------------------------- FIND ----------------------------- */
export const findById = async (id) => {
  return await Cart.findById(id);
};

export const findByUser = async (userId) => {
  return await Cart.findOne({ user: userId, isDeleted: false });
};

/* ----------------------------- FIND ALL ----------------------------- */
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const [carts, total] = await Promise.all([
    Cart.find(filters)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.skip),
    Cart.countDocuments(filters)
  ]);

  return { carts, total };
};

/* ----------------------------- UPDATE ----------------------------- */
export const update = async (id, newData) => {
  return await Cart.findByIdAndUpdate(id, newData, {
    new: true,
    runValidators: true
  });
};

/* ----------------------------- UPSERT (Create or Update Cart) ----------------------------- */
export const upsertByUser = async (userId, updateData) => {
  return await Cart.findOneAndUpdate(
    { user: userId },
    updateData,
    { new: true, upsert: true, runValidators: true }
  );
};

/* ----------------------------- DELETE ----------------------------- */
// Hard delete
export const hRemove = async (id) => {
  return await Cart.findByIdAndDelete(id);
};

// Soft delete
export const remove = async (id) => {
  return await Cart.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

/* ----------------------------- DELETE MANY ----------------------------- */
// Hard delete all
export const hRemoveAll = async (ids) => {
  return await Cart.deleteMany({ _id: { $in: ids } });
};

// Soft delete all
export const removeAll = async (ids) => {
  return await Cart.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } },
    { runValidators: true }
  );
};
