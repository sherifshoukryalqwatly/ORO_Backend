import express from "express";
import * as userController from '../controllers/user.controller.js';
import validationMiddleware from "../middlewares/validation.middleware.js";
import { createUserSchema , updateUserSchema } from '../validations/user.validation.js'
import { authorizeRole, isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

router.route('/by_email/:email')
    .get(authorizeRole('admin'), userController.findByEmail)

router.route('/me')
    .get(userController.getMe);

router.route('/:id')
    .patch(validationMiddleware(updateUserSchema), userController.update)
    .delete(userController.remove)
    .get(authorizeRole('admin'),userController.findById);

router.route('/')
    .get(authorizeRole('admin'),userController.findAll)
    .post(authorizeRole('admin'),validationMiddleware(createUserSchema), userController.create)
    .delete(authorizeRole('admin'),userController.removeAll);


export default router;