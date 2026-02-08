import Inventory from '../models/inventory.model.js';

// CREATE
export const create = async (data) => {
    const inventory = new Inventory(data);
    return await inventory.save();
};

// FIND BY ID
export const findById = async (id) => {
    return await Inventory.findById(id);
};

// FIND BY PRODUCT
export const findByProduct = async (productId) => {
    return await Inventory.findOne({ product: productId });
};

// FIND ALL
export const findAll = async (filters = {}, sort = { createdAt: -1 }, pagination = {}) => {
    const [inventories, total] = await Promise.all([
        Inventory.find(filters)
            .sort(sort)
            .limit(pagination.limit)
            .skip(pagination.skip),
        Inventory.countDocuments(filters)
    ]);

    return { inventories, total };
};

// UPDATE
export const update = async (id, newData) => {
    return await Inventory.findByIdAndUpdate(id, newData, { new: true });
};

// SOFT DELETE
export const remove = async (id) => {
    return await Inventory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

// HARD DELETE
export const hRemove = async (id) => {
    return await Inventory.findByIdAndDelete(id);
};

// BULK SOFT DELETE
export const removeAll = async (ids) => {
    return await Inventory.updateMany(
        { _id: { $in: ids } },
        { $set: { isDeleted: true } }
    );
};

// BULK HARD DELETE
export const hRemoveAll = async (ids) => {
    return await Inventory.deleteMany({ _id: { $in: ids } });
};
