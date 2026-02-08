import * as notificationService from "../services/notification.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";
import { auditLogService } from "../services/auditlog.service.js";

// Helper function to log actions
const logAction = async ({ req, action, targetModel, targetId, description }) => {
    await auditLogService.createLog({
        user: req.user?.id || null,
        action,
        targetModel,
        targetId,
        description,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
    });
};

// ------------------- CREATE -------------------
export const create = asyncWrapper(async (req, res) => {
    const notification = await notificationService.create(req.body);

    await logAction({
        req,
        action: "CREATE",
        targetModel: "Notification",
        targetId: notification._id,
        description: `Created new notification for user ${notification.user}`
    });

    return appResponses.success(
        res,
        notification,
        "Notification created successfully / تم إنشاء الإشعار بنجاح",
        201
    );
});

// ------------------- FIND BY ID -------------------
export const findById = asyncWrapper(async (req, res) => {
    const notification = await notificationService.findById(req.params.id);

    await logAction({
        req,
        action: "READ",
        targetModel: "Notification",
        targetId: notification._id,
        description: "Fetched notification by ID"
    });

    return appResponses.success(
        res,
        notification,
        "Notification retrieved successfully / تم استرجاع الإشعار بنجاح"
    );
});

// ------------------- FIND BY USER -------------------
export const findByUser = asyncWrapper(async (req, res) => {
    const { notifications, total, pages } = await notificationService.findByUser(
        req.params.userId,
        req.query
    );

    await logAction({
        req,
        action: "READ",
        targetModel: "Notification",
        description: `Fetched notifications for user ${req.params.userId} (count: ${notifications.length})`
    });

    return appResponses.success(
        res,
        { data: notifications, total, pages },
        "User notifications retrieved successfully / تم استرجاع إشعارات المستخدم بنجاح"
    );
});

// ------------------- UPDATE -------------------
export const update = asyncWrapper(async (req, res) => {
    const updatedNotification = await notificationService.update(req.params.id, req.body);

    await logAction({
        req,
        action: "UPDATE",
        targetModel: "Notification",
        targetId: updatedNotification._id,
        description: `Updated notification ${updatedNotification._id}`
    });

    return appResponses.success(
        res,
        updatedNotification,
        "Notification updated successfully / تم تعديل الإشعار بنجاح"
    );
});

// ------------------- SOFT DELETE -------------------
export const remove = asyncWrapper(async (req, res) => {
    await notificationService.remove(req.params.id);

    await logAction({
        req,
        action: "DELETE",
        targetModel: "Notification",
        targetId: req.params.id,
        description: "Soft deleted notification"
    });

    return appResponses.success(
        res,
        null,
        "Notification deleted successfully / تم حذف الإشعار بنجاح"
    );
});

// ------------------- HARD DELETE -------------------
export const hRemove = asyncWrapper(async (req, res) => {
    await notificationService.hRemove(req.params.id);

    await logAction({
        req,
        action: "DELETE",
        targetModel: "Notification",
        targetId: req.params.id,
        description: "Hard deleted notification"
    });

    return appResponses.success(
        res,
        null,
        "Notification permanently deleted / تم حذف الإشعار نهائياً"
    );
});

// ------------------- BULK SOFT DELETE -------------------
export const removeAll = asyncWrapper(async (req, res) => {
    await notificationService.removeAll(req.body.ids);

    await logAction({
        req,
        action: "DELETE",
        targetModel: "Notification",
        description: `Soft deleted multiple notifications: ${req.body.ids.join(", ")}`
    });

    return appResponses.success(
        res,
        null,
        "Notifications deleted successfully / تم حذف الإشعارات بنجاح"
    );
});

// ------------------- BULK HARD DELETE -------------------
export const hRemoveAll = asyncWrapper(async (req, res) => {
    await notificationService.hRemoveAll(req.body.ids);

    await logAction({
        req,
        action: "DELETE",
        targetModel: "Notification",
        description: `Hard deleted multiple notifications: ${req.body.ids.join(", ")}`
    });

    return appResponses.success(
        res,
        null,
        "Notifications permanently deleted / تم حذف الإشعارات نهائياً"
    );
});
