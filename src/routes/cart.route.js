import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import { 
  addItemSchema,
  updateItemSchema,
  removeItemSchema,
  cartIdSchema,
  deleteCartsSchema
} from '../validations/cart.validation.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* ----------------------------- USER CART ----------------------------- */
router.use(isAuthenticated);

// Get my cart
router.get('/me', cartController.getMyCart);

// Add item to cart
router.post(
  '/items',
  validationMiddleware(addItemSchema),
  cartController.addItem
);

// Update item quantity
router.patch(
  '/items/:productId',
  validationMiddleware(updateItemSchema),
  cartController.updateItem
);

// Remove item from cart
router.delete(
  '/items/:productId',
  validationMiddleware(removeItemSchema),
  cartController.removeItem
);

// Clear my cart
router.delete('/me', cartController.clearCart);

/* ----------------------------- ADMIN CART ----------------------------- */
router.use(authorizeRole('admin'));

// Get cart by ID
router.get('/:id', validationMiddleware(cartIdSchema), cartController.findById);

// Get all carts (filters / sort / pagination optional)
router.get('/', cartController.findAll);

// Soft delete cart
router.delete('/:id', validationMiddleware(cartIdSchema), cartController.remove);

// Hard delete cart
router.delete('/hard/:id', validationMiddleware(cartIdSchema), cartController.hRemove);

// Soft delete multiple carts
router.delete(
  '/bulk',
  validationMiddleware(deleteCartsSchema),
  cartController.removeAll
);

// Hard delete multiple carts
router.delete(
  '/bulk/hard',
  validationMiddleware(deleteCartsSchema),
  cartController.hRemoveAll
);

export default router;
