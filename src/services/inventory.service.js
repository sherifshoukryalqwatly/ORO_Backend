import * as inventoryRepo from '../repos/inventory.repo.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

// CREATE
export const create = async (data) => {
    // Check if product inventory already exists
    const existing = await inventoryRepo.findByProduct(data.product);
    if (existing) throw ApiError.conflict('Inventory for this product already exists / المخزون لهذا المنتج موجود مسبقاً');

    const inventory = await inventoryRepo.create(data);
    return inventory;
};

// FIND BY ID
export const findById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid Inventory Id / Id المخزون خطأ');

    const inventory = await inventoryRepo.findById(id);
    if (!inventory) throw ApiError.notFound('Inventory not found / المخزون غير موجود');

    return inventory;
};

// FIND BY PRODUCT
export const findByProduct = async (productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) throw ApiError.badRequest('Invalid Product Id / Id المنتج خطأ');

    const inventory = await inventoryRepo.findByProduct(productId);
    if (!inventory) throw ApiError.notFound('Inventory not found / المخزون غير موجود');

    return inventory;
};

// FIND ALL
export const findAll = async (filters = {}, sort = { createdAt: -1 }, pagination = {}) => {
    return await inventoryRepo.findAll(filters, sort, pagination);
};

// UPDATE
export const update = async (id, newData) => {
    const inventory = await findById(id);

    if (newData.quantity != null && newData.quantity < 0) {
        throw ApiError.badRequest('Quantity must be at least 0 / يجب أن تكون الكمية 0 على الأقل');
    }

    return await inventoryRepo.update(id, newData);
};

// SOFT DELETE
export const remove = async (id) => {
    await findById(id);
    return await inventoryRepo.remove(id);
};

// HARD DELETE
export const hRemove = async (id) => {
    await findById(id);
    return await inventoryRepo.hRemove(id);
};

// BULK SOFT DELETE
export const removeAll = async (ids) => {
    if (!Array.isArray(ids) || !ids.length) throw ApiError.badRequest('IDs array is required / مصفوفة Ids مطلوبة');

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    return await inventoryRepo.removeAll(validIds);
};

// BULK HARD DELETE
export const hRemoveAll = async (ids) => {
    if (!Array.isArray(ids) || !ids.length) throw ApiError.badRequest('IDs array is required / مصفوفة Ids مطلوبة');

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    return await inventoryRepo.hRemoveAll(validIds);
};
