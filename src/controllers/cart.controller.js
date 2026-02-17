import * as cartService from '../services/cart.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';

/* ----------------------------- USER CART ----------------------------- */

// GET MY CART
export const getMyCart = asyncWrapper(async (req, res) => {
  const cart = await cartService.getMyCart(req.user.id);

  return appResponses.success(
    res,
    cart,
    'Cart Retrieved Successfully / تم جلب السلة بنجاح'
  );
});

// ADD ITEM TO CART
export const addItem = asyncWrapper(async (req, res) => {
  const { productId } = req.params;
  const cart = await cartService.addItem(req.user.id, productId);

  return appResponses.success(
    res,
    cart,
    'Item Added To Cart Successfully / تم إضافة المنتج إلى السلة',
    201
  );
});

// UPDATE ITEM QUANTITY
export const updateItem = asyncWrapper(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await cartService.updateItem(
    req.user.id,
    productId,
    quantity
  );

  return appResponses.success(
    res,
    cart,
    'Cart Updated Successfully / تم تعديل السلة بنجاح'
  );
});

// REMOVE ITEM FROM CART
export const removeItem = asyncWrapper(async (req, res) => {
  const { productId } = req.params;

  const cart = await cartService.removeItem(req.user.id, productId);

  return appResponses.success(
    res,
    cart,
    'Item Removed From Cart Successfully / تم حذف المنتج من السلة'
  );
});

// CLEAR CART
export const clearCart = asyncWrapper(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);

  return appResponses.success(
    res,
    cart,
    'Cart Cleared Successfully / تم إفراغ السلة بنجاح'
  );
});

/* ----------------------------- ADMIN ----------------------------- */

// GET CART BY ID
export const findById = asyncWrapper(async (req, res) => {
  const cart = await cartService.findById(req.params.id);

  return appResponses.success(
    res,
    cart,
    'Cart Retrieved Successfully / تم جلب السلة بنجاح'
  );
});

// GET ALL CARTS
export const findAll = asyncWrapper(async (req, res) => {
  const result = await cartService.findAll({}, {}, {});

  return appResponses.success(
    res,
    result,
    'Carts Retrieved Successfully / تم جلب السلال بنجاح'
  );
});






