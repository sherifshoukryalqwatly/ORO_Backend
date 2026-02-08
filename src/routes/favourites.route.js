import express from "express";
import * as favouriteController from '../controllers/favourites.controller.js';
import validationMiddleware from "../middlewares/validation.middleware.js";
import {
  createFavouriteSchema,
  updateFavouriteSchema,
  favouriteIdSchema,
  deleteFavouritesSchema
} from '../validations/favourites.validation.js';
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// كل المسارات تتطلب توثيق الدخول
router.use(isAuthenticated);

// ------------------- CREATE OR GET -------------------
router.route('/')
  .post(favouriteController.createOrGet);

// ------------------- GET BY USER -------------------
router.route('/me')
  .get(favouriteController.findByUser);

// ------------------- UPDATE -------------------
router.route('/:id')
  .patch(
    validationMiddleware(favouriteIdSchema, 'params'),
    validationMiddleware(updateFavouriteSchema),
    favouriteController.update
  )
  .delete(
    validationMiddleware(favouriteIdSchema, 'params'),
    favouriteController.remove
  );

// ------------------- HARD DELETE -------------------
router.route('/hdelete/:id')
  .delete(
    validationMiddleware(favouriteIdSchema, 'params'),
    favouriteController.hRemove
  );

// ------------------- BULK SOFT DELETE -------------------
router.route('/delete_all')
  .delete(
    validationMiddleware(deleteFavouritesSchema),
    favouriteController.removeAll
  );

// ------------------- BULK HARD DELETE -------------------
router.route('/hdelete_all')
  .delete(
    validationMiddleware(deleteFavouritesSchema),
    favouriteController.hRemoveAll
  );

export default router;
