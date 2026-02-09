import Shipping from "../models/shipping.model.js";

// CREATE
export const create = async (data) => {
  const shipping = new Shipping(data);
  return await shipping.save();
};

// FIND BY ID
export const findById = async (id) => {
  return await Shipping.findById(id).populate("order");
};

// FIND BY ORDER
export const findByOrder = async (orderId) => {
  return await Shipping.findOne({ order: orderId }).populate("order");
};

// FIND ALL
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const { skip = 0, limit = 10 } = pagination;

  const [shippings, total] = await Promise.all([
    Shipping.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("order"),
    Shipping.countDocuments(filters),
  ]);

  return { shippings, total };
};

// UPDATE (SAFE)
export const update = async (id, data) => {
  const shipping = await Shipping.findById(id);
  if (!shipping) return null;

  Object.assign(shipping, data);
  return await shipping.save();
};

// SOFT DELETE
export const remove = async (id) => {
  const shipping = await Shipping.findById(id);
  if (!shipping) return null;

  shipping.isDeleted = true;
  return await shipping.save();
};
