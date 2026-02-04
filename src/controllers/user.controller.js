import * as userService from '../services/user.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';
// import { auditLogService } from '../services/auditlog.service.js';

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

// CREATE
export const create = asyncWrapper(async (req, res) => {
    const user = await userService.create(req.body);

    await logAction({
        req,
        action: 'CREATE',
        targetModel: 'User',
        targetId: user._id,
        description: `Created new user ${user.email}`
    });

    return appResponses.success(res, user, 'User Registered Successfully / تم تسجيل المستخدم بنجاح', 201);
});

// FIND BY ID
export const findById = asyncWrapper(async (req, res) => {
    const user = await userService.findById(req.params.id);

    await logAction({
        req,
        action: 'READ',
        targetModel: 'User',
        targetId: req.params.id,
        description: 'Fetched user by ID'
    });

    return appResponses.success(res, user, 'User Retrieved Successfully / تم استرداد المستخدم بنجاح');
});

// FIND BY EMAIL
export const findByEmail = asyncWrapper(async (req, res) => {
    const user = await userService.findByEmail(req.params.email);

    await logAction({
        req,
        action: 'READ',
        targetModel: 'User',
        targetId: user._id,
        description: `Fetched user by email: ${req.params.email}`
    });

    return appResponses.success(res, user, 'User Retrieved Successfully / تم استرداد المستخدم بنجاح');
});

// FIND ALL
export const findAll = asyncWrapper(async (req, res) => {
    const { users, total, pages } = await userService.findAll(req.query);

    await logAction({
        req,
        action: 'READ',
        targetModel: 'User',
        description: `Fetched all users (count: ${users.length})`
    });

    return appResponses.success(res, { data: users, total, pages }, 'Users Retrieved Successfully / تم استرداد المستخدمين بنجاح');
});

// UPDATE
export const update = asyncWrapper(async (req, res) => {
    const updatedUser = await userService.update(req.params.id, req.body);

    await logAction({
        req,
        action: 'UPDATE',
        targetModel: 'User',
        targetId: updatedUser._id,
        description: `Updated user ${updatedUser.email}`
    });

    return appResponses.success(res, updatedUser, 'User Updated Successfully / تم تعديل المستخدم بنجاح');
});

// HARD DELETE
export const hRemove = asyncWrapper(async (req, res) => {
    await userService.hRemove(req.params.id);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'User',
        targetId: req.params.id,
        description: 'Hard deleted user'
    });

    return appResponses.success(res, null, 'User Deleted Successfully / تم حذف المستخدم بنجاح');
});

// SOFT DELETE
export const remove = asyncWrapper(async (req, res) => {
    await userService.remove(req.params.id);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'User',
        targetId: req.params.id,
        description: 'Soft deleted user'
    });

    return appResponses.success(res, null, 'User Deleted Successfully / تم حذف المستخدم بنجاح');
});

// HARD DELETE ALL
export const hRemoveAll = asyncWrapper(async (req, res) => {
    await userService.hRemoveAll(req.body.ids);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'User',
        description: `Hard deleted multiple users: ${req.body.ids.join(', ')}`
    });

    return appResponses.success(res, null, 'Users Deleted Successfully / تم حذف المستخدمين بنجاح');
});

// SOFT DELETE ALL
export const removeAll = asyncWrapper(async (req, res) => {
    await userService.removeAll(req.body.ids);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'User',
        description: `Soft deleted multiple users: ${req.body.ids.join(', ')}`
    });

    return appResponses.success(res, null, 'Users Deleted Successfully / تم حذف المستخدمين بنجاح');
});

// GET ME
export const getMe = asyncWrapper(async (req, res) => {
    const user = await userService.getMe(req.user.id);

    await logAction({
        req,
        action: 'READ',
        targetModel: 'User',
        targetId: req.user.id,
        description: 'Retrieved own profile'
    });

    return appResponses.success(res, user, 'User Retrieved Successfully / تم استرداد المستخدم بنجاح');
});