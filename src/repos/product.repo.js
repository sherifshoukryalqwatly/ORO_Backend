import Product from "../models/product.model.js";

// CREATE
export const create = async (data) => {
  const product = new Product(data);
  return await product.save();
};

// FIND BY ID
export const findById = async (id) => {
  return await Product.findById(id).populate("category");
};

// FIND ALL
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const { skip = 0, limit = 10 } = pagination;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("category"),
    Product.countDocuments(filters),
  ]);

  return { products, total };
};

// UPDATE
export const update = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

// SOFT DELETE
export const remove = async (id) => {
  return await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

// HARD DELETE
export const hRemove = async (id) => {
  return await Product.findByIdAndDelete(id);
};
