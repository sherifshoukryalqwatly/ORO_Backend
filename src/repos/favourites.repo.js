import Favourite from '../models/favourites.model.js';

// CREATE or GET if already exists
export const createOrGet = async (data) => {
  let favourite = await Favourite.findOne({ user: data.user });
  if (favourite) return favourite;

  favourite = new Favourite(data);
  return await favourite.save();
};

// GET BY ID
export const findById = async (id) => {
  return await Favourite.findById(id).populate('products');
};

// GET BY USER
export const findByUser = async (userId) => {
  return await Favourite.findOne({ user: userId }).populate('products');
};

// GET ALL
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  const [favourites, total] = await Promise.all([
    Favourite.find(filters)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.skip)
      .populate('products'),
    Favourite.countDocuments(filters)
  ]);
  return { favourites, total };
};

// UPDATE (Add/Remove products)
export const update = async (id, newData) => {
  return await Favourite.findByIdAndUpdate(id, newData, { new: true }).populate('products');
};

// SOFT DELETE
export const remove = async (id) => {
  return await Favourite.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

// HARD DELETE
export const hRemove = async (id) => {
  return await Favourite.findByIdAndDelete(id);
};

// BULK SOFT DELETE
export const removeAll = async (ids) => {
  return await Favourite.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } }
  );
};

// BULK HARD DELETE
export const hRemoveAll = async (ids) => {
  return await Favourite.deleteMany({ _id: { $in: ids } });
};
