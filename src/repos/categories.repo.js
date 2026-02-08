import Category from '../models/categories.model.js';

/* ----------------------------- CREATE ----------------------------- */
export const create = async (data) => {
  const category = new Category(data);
  return await category.save();
};

/* ----------------------------- FIND ----------------------------- */
export const findById = async (id) => {
  return await Category.findById(id);
};

export const findBySlug = async (slug, lang = 'en') => {
  return await Category.findOne({ [`slug.${lang}`]: slug, isDeleted: false });
};

/* ----------------------------- FIND ALL ----------------------------- */
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const [categories, total] = await Promise.all([
    Category.find(filters)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.skip),
    Category.countDocuments(filters)
  ]);

  return { categories, total };
};

/* ----------------------------- UPDATE ----------------------------- */
export const update = async (id, newData) => {
  return await Category.findByIdAndUpdate(id, newData, {
    new: true,
    runValidators: true
  });
};

/* ----------------------------- DELETE ----------------------------- */
// Hard delete
export const hRemove = async (id) => {
  return await Category.findByIdAndDelete(id);
};

// Soft delete
export const remove = async (id) => {
  return await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

/* ----------------------------- DELETE MANY ----------------------------- */
// Hard delete all
export const hRemoveAll = async (ids) => {
  return await Category.deleteMany({ _id: { $in: ids } });
};

// Soft delete all
export const removeAll = async (ids) => {
  return await Category.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } },
    { runValidators: true }
  );
};
