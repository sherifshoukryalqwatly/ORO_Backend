import express from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import { 
    createInventorySchema, 
    updateInventorySchema, 
    inventoryIdSchema, 
    deleteInventoriesSchema 
} from "../validations/inventory.validation.js";

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// ------------------- CREATE -------------------
router.post(
    "/",
    authorizeRole("admin"),
    validationMiddleware(createInventorySchema),
    inventoryController.create
);

// ------------------- FIND BY ID -------------------
router.get(
    "/:id",
    authorizeRole("admin"),
    validationMiddleware(inventoryIdSchema, "params"),
    inventoryController.findById
);

// ------------------- FIND BY PRODUCT -------------------
router.get(
    "/product/:productId",
    authorizeRole("admin"),
    inventoryController.findByProduct
);

// ------------------- FIND ALL -------------------
router.get("/", authorizeRole("admin"), inventoryController.findAll);

// ------------------- UPDATE -------------------
router.patch(
    "/:id",
    authorizeRole("admin"),
    validationMiddleware(inventoryIdSchema, "params"),
    validationMiddleware(updateInventorySchema),
    inventoryController.update
);

// ------------------- SOFT DELETE -------------------
router.delete(
    "/:id",
    authorizeRole("admin"),
    validationMiddleware(inventoryIdSchema, "params"),
    inventoryController.remove
);

// ------------------- HARD DELETE -------------------
router.delete(
    "/hard/:id",
    authorizeRole("admin"),
    validationMiddleware(inventoryIdSchema, "params"),
    inventoryController.hRemove
);

// ------------------- BULK SOFT DELETE -------------------
router.delete(
    "/",
    authorizeRole("admin"),
    validationMiddleware(deleteInventoriesSchema),
    inventoryController.removeAll
);

// ------------------- BULK HARD DELETE -------------------
router.delete(
    "/hard",
    authorizeRole("admin"),
    validationMiddleware(deleteInventoriesSchema),
    inventoryController.hRemoveAll
);

export default router;
