import express from "express";
import * as wishlistController from '../controllers/wishlist.controller.js';
import validationMiddleware from "../middlewares/validation.middleware.js";
import {
  productParamSchema,
  addToWishlistSchema,
  removeFromWishlistSchema,
  emptySchema
} from '../validations/wishlist.validation.js';
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   All routes require authentication
================================= */
router.use(isAuthenticated);


/* ===============================
   GET MY WISHLIST
   GET /api/wishlist
================================= */
router.get(
  '/',
  validationMiddleware(emptySchema),
  wishlistController.getMyWishlist
);


/* ===============================
   ADD ITEM TO WISHLIST
   POST /api/wishlist/:productId
================================= */
router.post(
  '/:productId',
  validationMiddleware(productParamSchema, 'params'),
  validationMiddleware(addToWishlistSchema), // body
  wishlistController.addToWishlist
);


/* ===============================
   REMOVE ITEM FROM WISHLIST
   DELETE /api/wishlist/:productId
================================= */
router.delete(
  '/:productId',
  validationMiddleware(productParamSchema, 'params'),
  validationMiddleware(removeFromWishlistSchema), // body
  wishlistController.removeFromWishlist
);

export default router;