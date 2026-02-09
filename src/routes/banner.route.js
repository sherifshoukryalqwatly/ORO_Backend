import express from 'express';
import * as bannerController from '../controllers/banner.controller.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import {
  createBannerSchema,
  updateBannerSchema,
  deleteBannerSchema,
  bannerIdSchema
} from '../validations/banner.validation.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';

const router = express.Router();

/* ----------------------------- PUBLIC ----------------------------- */
// Get active banners (Homepage)
router.get('/public', bannerController.findActive);

/* ----------------------------- PROTECTED ----------------------------- */
router.use(isAuthenticated);

/* ----------------------------- ADMIN ----------------------------- */

// Create banner
router.post(
  '/',
  authorizeRole('admin'),
  upload.single("image"),
  validationMiddleware(createBannerSchema),
  bannerController.create
);

// Get all banners (filters / sort / pagination)
router.get(
  '/',
  authorizeRole('admin'),
  bannerController.findAll
);

// Get banner by id
router.get(
  '/:id',
  authorizeRole('admin'),
  validationMiddleware(bannerIdSchema),
  bannerController.findById
);

// Update banner
router.patch(
  '/:id',
  authorizeRole('admin'),
  upload.single("image"),
  validationMiddleware(updateBannerSchema),
  bannerController.update
);

// Soft delete banner
router.delete(
  '/:id',
  authorizeRole('admin'),
  validationMiddleware(bannerIdSchema),
  bannerController.remove
);

// Hard delete banners (bulk)
router.delete(
  '/',
  authorizeRole('admin'),
  validationMiddleware(deleteBannerSchema),
  bannerController.removeAll
);

export default router;
