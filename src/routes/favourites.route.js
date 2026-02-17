import express from "express";
import * as favouriteController from '../controllers/favourites.controller.js';
import validationMiddleware from "../middlewares/validation.middleware.js";
import {
  productParamSchema,
  emptySchema
} from '../validations/favourites.validation.js';
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   All routes require authentication
================================= */
router.use(isAuthenticated);


/* ===============================
   GET MY FAVOURITES
   GET /api/favourites
================================= */
router.get(
  '/',
  validationMiddleware(emptySchema),
  favouriteController.getMyFavourites
);


/* ===============================
   ADD PRODUCT TO FAVOURITES
   POST /api/favourites/:productId
================================= */
router.post(
  '/:productId',
  validationMiddleware(productParamSchema, 'params'),
  favouriteController.addToFavourite
);


/* ===============================
   REMOVE PRODUCT FROM FAVOURITES
   DELETE /api/favourites/:productId
================================= */
router.delete(
  '/:productId',
  validationMiddleware(productParamSchema, 'params'),
  favouriteController.removeFromFavourite
);

export default router;
