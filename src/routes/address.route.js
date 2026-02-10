import express from 'express';
import * as addressController from '../controllers/address.controller.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
  addressIdsBodySchema,
} from '../validations/address.validation.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';
import { validateParams } from '../middlewares/validate_param.middleware.js';

const router = express.Router();

// ==========================
// AUTH MIDDLEWARE
// ==========================
router.use(isAuthenticated);

// ==========================
// MY ADDRESSES (USER)
// ==========================
router.route('/me')
  .get(addressController.findMyAddresses);

// ==========================
// ADDRESS BY ID
// ==========================
router.route('/:id')
  .get(
    validateParams(addressIdParamSchema, 'params'),
    addressController.findById
  )
  .patch(
    validateParams(addressIdParamSchema, 'params'),
    validationMiddleware(updateAddressSchema),
    addressController.update
  )
  .delete(
    validateParams(addressIdParamSchema, 'params'),
    addressController.remove
  );

// ==========================
// ALL ADDRESSES (ADMIN)
// ==========================
router.route('/')
  .get(authorizeRole('admin'), addressController.findAll)
  .post(
    validationMiddleware(createAddressSchema),
    addressController.create
  )
  .delete(
    authorizeRole('admin'),
    validationMiddleware(addressIdsBodySchema),
    addressController.removeAll
  );

// ==========================
// HARD DELETE (ADMIN)
// ==========================
router.route('/hard/delete')
  .delete(
    authorizeRole('admin'),
    validationMiddleware(addressIdsBodySchema),
    addressController.hRemoveAll
  );

router.route('/hard/:id')
  .delete(
    authorizeRole('admin'),
    validateParams(addressIdParamSchema, 'params'),
    addressController.hRemove
  );

export default router;