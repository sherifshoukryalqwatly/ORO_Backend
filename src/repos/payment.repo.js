import Payment from "../models/payment.model.js";

// CREATE
export const create = async (data) => {
  const payment = new Payment(data);
  return await payment.save();
};

// FIND BY ID
export const findById = async (id) => {
  return await Payment.findById(id)
    .populate("user", "email")
    .populate("order");
};

// FIND ALL
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const { skip = 0, limit = 10 } = pagination;

  const [payments, total] = await Promise.all([
    Payment.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("user", "email")
      .populate("order"),
    Payment.countDocuments(filters),
  ]);

  return { payments, total };
};

// FIND BY USER
export const findByUser = async (userId, filters = {}, sort = {}, pagination = {}) => {
  return await findAll({ ...filters, user: userId }, sort, pagination);
};

// UPDATE
export const update = async (id, data) => {
  return await Payment.findByIdAndUpdate(id, data, { new: true });
};

// SOFT DELETE
export const remove = async (id) => {
  return await Payment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

// HARD DELETE
export const hRemove = async (id) => {
  return await Payment.findByIdAndDelete(id);
};
