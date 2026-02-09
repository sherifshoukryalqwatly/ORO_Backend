import Refund from "../models/refund.model.js";

// CREATE
export const create = async (data) => {
  const refund = new Refund(data);
  return await refund.save();
};

// FIND BY ID
export const findById = async (id) => {
  return await Refund.findById(id)
    .populate("user")
    .populate("order")
    .populate("payment");
};

// FIND ALL
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const { skip = 0, limit = 10 } = pagination;

  const [refunds, total] = await Promise.all([
    Refund.find({ isDeleted: false, ...filters })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("user order payment"),
    Refund.countDocuments({ isDeleted: false, ...filters }),
  ]);

  return { refunds, total };
};

// UPDATE (SAFE – triggers hooks)
export const update = async (id, data) => {
  const refund = await Refund.findById(id);
  if (!refund) return null;

  Object.assign(refund, data);
  return await refund.save();
};

// SOFT DELETE
export const remove = async (id) => {
  const refund = await Refund.findById(id);
  if (!refund) return null;

  refund.isDeleted = true;
  return await refund.save();
};
