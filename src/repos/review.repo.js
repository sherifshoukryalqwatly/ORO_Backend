import Review from "../models/review.model.js";

// CREATE
export const create = async (data) => {
  const review = new Review(data);
  return await review.save();
};

// FIND BY ID
export const findById = async (id) => {
  return await Review.findById(id)
    .populate("user", "name")
    .populate("product", "title ratingsAverage");
};

// FIND BY PRODUCT
export const findByProduct = async (productId, pagination = {}) => {
  const { skip = 0, limit = 10 } = pagination;

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .skip(skip)
      .limit(limit)
      .populate("user", "name"),
    Review.countDocuments({ product: productId }),
  ]);

  return { reviews, total };
};

// FIND ALL (ADMIN)
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const { skip = 0, limit = 10 } = pagination;

  const [reviews, total] = await Promise.all([
    Review.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("user product"),
    Review.countDocuments(filters),
  ]);

  return { reviews, total };
};

// UPDATE (SAFE)
export const update = async (id, data) => {
  const review = await Review.findById(id);
  if (!review) return null;

  Object.assign(review, data);
  return await review.save();
};

// SOFT DELETE
export const remove = async (id) => {
  const review = await Review.findById(id);
  if (!review) return null;

  review.isDeleted = true;
  return await review.save();
};
