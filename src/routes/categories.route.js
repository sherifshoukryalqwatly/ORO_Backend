import express from 'express';
import * as categoryController from '../controllers/categories.controller.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import { 
  createCategorySchema, 
  updateCategorySchema, 
  categoryIdSchema, 
  deleteCategoriesSchema,
  findBySlugSchema
} from '../validations/categories.validation.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* ----------------------------- PUBLIC ----------------------------- */
// Get category by slug
router.get(
  '/slug/:slug',
  validationMiddleware(findBySlugSchema),
  categoryController.findBySlug
);

/* ----------------------------- ADMIN ----------------------------- */
router.use(isAuthenticated, authorizeRole('admin'));

// Create category
router.post(
  '/',
  validationMiddleware(createCategorySchema),
  categoryController.create
);

// Get all categories (with optional filters/sort/pagination)
router.get(
  '/',
  categoryController.findAll
);

// Get category by ID
router.get(
  '/:id',
  validationMiddleware(categoryIdSchema),
  categoryController.findById
);

// Update category
router.patch(
  '/:id',
  validationMiddleware(updateCategorySchema),
  categoryController.update
);

// Soft delete category
router.delete(
  '/:id',
  validationMiddleware(categoryIdSchema),
  categoryController.remove
);

// Hard delete category
router.delete(
  '/hard/:id',
  validationMiddleware(categoryIdSchema),
  categoryController.hRemove
);

// Soft delete multiple categories
router.delete(
  '/bulk',
  validationMiddleware(deleteCategoriesSchema),
  categoryController.removeAll
);

// Hard delete multiple categories
router.delete(
  '/bulk/hard',
  validationMiddleware(deleteCategoriesSchema),
  categoryController.hRemoveAll
);

export default router;
