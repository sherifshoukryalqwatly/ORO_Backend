import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import {
    createNotificationSchema,
    updateNotificationSchema,
    bulkIdsSchema
} from "../validations/notification.validation.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// جميع الراوترات تحتاج توثيق
router.use(isAuthenticated);

// ------------------- CREATE -------------------
router.post(
    "/",
    validationMiddleware(createNotificationSchema),
    notificationController.create
);

// ------------------- FIND BY ID -------------------
router.get("/:id", notificationController.findById);

// ------------------- FIND BY USER -------------------
router.get("/user/:userId", notificationController.findByUser);

// ------------------- UPDATE -------------------
router.patch(
    "/:id",
    validationMiddleware(updateNotificationSchema),
    notificationController.update
);

// ------------------- SOFT DELETE -------------------
router.delete("/:id", notificationController.remove);

// ------------------- HARD DELETE -------------------
router.delete("/hard/:id", authorizeRole("admin"), notificationController.hRemove);

// ------------------- BULK SOFT DELETE -------------------
router.delete(
    "/bulk",
    validationMiddleware(bulkIdsSchema),
    notificationController.removeAll
);

// ------------------- BULK HARD DELETE -------------------
router.delete(
    "/bulk/hard",
    authorizeRole("admin"),
    validationMiddleware(bulkIdsSchema),
    notificationController.hRemoveAll
);

export default router;
