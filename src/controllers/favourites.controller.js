import * as favouriteService from '../services/favourites.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';
import { auditLogService } from '../services/auditlog.service.js';

/* ----------------------------- HELPER ----------------------------- */
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

/* ----------------------------- CREATE OR GET ----------------------------- */
export const createOrGet = asyncWrapper(async (req, res) => {
    const favourite = await favouriteService.createOrGet(req.user._id);

    await logAction({
        req,
        action: 'CREATE',
        targetModel: 'Favourite',
        targetId: favourite._id,
        description: 'Created or fetched user favourites'
    });

    return appResponses.success(res, favourite, 'Favourite Retrieved Successfully / تم استرجاع المفضلات بنجاح', 201);
});

/* ----------------------------- GET BY USER ----------------------------- */
export const findByUser = asyncWrapper(async (req, res) => {
    const favourite = await favouriteService.findByUser(req.user._id);

    await logAction({
        req,
        action: 'READ',
        targetModel: 'Favourite',
        targetId: favourite._id,
        description: 'Fetched user favourites'
    });

    return appResponses.success(res, favourite, 'Favourite Retrieved Successfully / تم استرجاع المفضلات بنجاح');
});

/* ----------------------------- UPDATE ----------------------------- */
export const update = asyncWrapper(async (req, res) => {
    const updatedFavourite = await favouriteService.update(req.params.id, req.body.products);

    await logAction({
        req,
        action: 'UPDATE',
        targetModel: 'Favourite',
        targetId: updatedFavourite._id,
        description: 'Updated user favourites'
    });

    return appResponses.success(res, updatedFavourite, 'Favourite Updated Successfully / تم تعديل المفضلات بنجاح');
});

/* ----------------------------- SOFT DELETE ----------------------------- */
export const remove = asyncWrapper(async (req, res) => {
    await favouriteService.remove(req.params.id);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Favourite',
        targetId: req.params.id,
        description: 'Soft deleted favourites'
    });

    return appResponses.success(res, null, 'Favourite Deleted Successfully / تم حذف المفضلات بنجاح');
});

/* ----------------------------- HARD DELETE ----------------------------- */
export const hRemove = asyncWrapper(async (req, res) => {
    await favouriteService.hRemove(req.params.id);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Favourite',
        targetId: req.params.id,
        description: 'Hard deleted favourites'
    });

    return appResponses.success(res, null, 'Favourite Hard Deleted Successfully / تم حذف المفضلات نهائياً');
});

/* ----------------------------- BULK SOFT DELETE ----------------------------- */
export const removeAll = asyncWrapper(async (req, res) => {
    await favouriteService.removeAll(req.body.ids);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Favourite',
        description: `Soft deleted multiple favourites: ${req.body.ids.join(', ')}`
    });

    return appResponses.success(res, null, 'Favourites Deleted Successfully / تم حذف المفضلات بنجاح');
});

/* ----------------------------- BULK HARD DELETE ----------------------------- */
export const hRemoveAll = asyncWrapper(async (req, res) => {
    await favouriteService.hRemoveAll(req.body.ids);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Favourite',
        description: `Hard deleted multiple favourites: ${req.body.ids.join(', ')}`
    });

    return appResponses.success(res, null, 'Favourites Hard Deleted Successfully / تم حذف المفضلات نهائياً');
});
