import * as inventoryService from '../services/inventory.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';
import { auditLogService } from '../services/auditlog.service.js';

// Helper function to log actions
const logAction = async ({ req, action, targetModel, targetId, description }) => {
    await auditLogService.createLog({
        user: req.user?.id || null,
        action,
        targetModel,
        targetId,
        description,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });
};

// ------------------- CREATE -------------------
export const create = asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.create(req.body);

    await logAction({
        req,
        action: 'CREATE',
        targetModel: 'Inventory',
        targetId: inventory._id,
        description: `Created inventory for product ${inventory.product}`
    });

    return appResponses.success(res, inventory, 'Inventory created successfully / تم إنشاء المخزون بنجاح', 201);
});

// ------------------- FIND BY ID -------------------
export const findById = asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.findById(req.params.id);

    await logAction({
        req,
        action: 'READ',
        targetModel: 'Inventory',
        targetId: req.params.id,
        description: 'Fetched inventory by ID'
    });

    return appResponses.success(res, inventory, 'Inventory retrieved successfully / تم استرجاع المخزون بنجاح');
});

// ------------------- FIND BY PRODUCT -------------------
export const findByProduct = asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.findByProduct(req.params.productId);

    await logAction({
        req,
        action: 'READ',
        targetModel: 'Inventory',
        targetId: inventory._id,
        description: `Fetched inventory for product ${req.params.productId}`
    });

    return appResponses.success(res, inventory, 'Inventory retrieved successfully / تم استرجاع المخزون بنجاح');
});

// ------------------- FIND ALL -------------------
export const findAll = asyncWrapper(async (req, res) => {
    const filters = {}; // يمكن إضافة filters حسب query لاحقًا
    const sort = { createdAt: -1 };
    const pagination = {
        limit: parseInt(req.query.limit, 10) || 10,
        skip: ((parseInt(req.query.page, 10) || 1) - 1) * (parseInt(req.query.limit, 10) || 10)
    };

    const result = await inventoryService.findAll(filters, sort, pagination);

    await logAction({
        req,
        action: 'READ',
        targetModel: 'Inventory',
        description: `Fetched all inventories (count: ${result.inventories.length})`
    });

    return appResponses.success(res, result, 'Inventories retrieved successfully / تم استرجاع جميع المخزونات بنجاح');
});

// ------------------- UPDATE -------------------
export const update = asyncWrapper(async (req, res) => {
    const updatedInventory = await inventoryService.update(req.params.id, req.body);

    await logAction({
        req,
        action: 'UPDATE',
        targetModel: 'Inventory',
        targetId: updatedInventory._id,
        description: `Updated inventory for product ${updatedInventory.product}`
    });

    return appResponses.success(res, updatedInventory, 'Inventory updated successfully / تم تعديل المخزون بنجاح');
});

// ------------------- SOFT DELETE -------------------
export const remove = asyncWrapper(async (req, res) => {
    await inventoryService.remove(req.params.id);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Inventory',
        targetId: req.params.id,
        description: 'Soft deleted inventory'
    });

    return appResponses.success(res, null, 'Inventory deleted successfully / تم حذف المخزون بنجاح');
});

// ------------------- HARD DELETE -------------------
export const hRemove = asyncWrapper(async (req, res) => {
    await inventoryService.hRemove(req.params.id);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Inventory',
        targetId: req.params.id,
        description: 'Hard deleted inventory'
    });

    return appResponses.success(res, null, 'Inventory deleted permanently / تم حذف المخزون نهائيًا');
});

// ------------------- BULK SOFT DELETE -------------------
export const removeAll = asyncWrapper(async (req, res) => {
    await inventoryService.removeAll(req.body.ids);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Inventory',
        description: `Soft deleted multiple inventories: ${req.body.ids.join(', ')}`
    });

    return appResponses.success(res, null, 'Inventories deleted successfully / تم حذف المخزونات بنجاح');
});

// ------------------- BULK HARD DELETE -------------------
export const hRemoveAll = asyncWrapper(async (req, res) => {
    await inventoryService.hRemoveAll(req.body.ids);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Inventory',
        description: `Hard deleted multiple inventories: ${req.body.ids.join(', ')}`
    });

    return appResponses.success(res, null, 'Inventories deleted permanently / تم حذف المخزونات نهائيًا');
});
