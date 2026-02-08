import * as cartRepo from '../repos/cart.repo.js';
import ApiError from '../utils/ApiError.js';

/* ----------------------------- HELPERS ----------------------------- */
const validateObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

/* ----------------------------- GET CART ----------------------------- */
export const getMyCart = async (userId) => {
  if (!validateObjectId(userId)) {
    throw ApiError.badRequest('Invalid User Id / رقم مستخدم غير صحيح');
  }

  const cart = await cartRepo.findByUser(userId);

  if (!cart) {
    return { items: [], totalPrice: 0, itemCount: 0 };
  }

  return cart;
};

/* ----------------------------- ADD / UPDATE ITEM ----------------------------- */
export const addItem = async (userId, itemData) => {
  if (!validateObjectId(userId)) {
    throw ApiError.badRequest('Invalid User Id / رقم مستخدم غير صحيح');
  }

  const cart = await cartRepo.findByUser(userId);

  // If cart doesn't exist → create new
  if (!cart) {
    return await cartRepo.create({
      user: userId,
      items: [itemData]
    });
  }

  // Check if product already exists in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === itemData.product
  );

  if (itemIndex > -1) {
    // Update quantity
    cart.items[itemIndex].quantity += itemData.quantity;
    cart.items[itemIndex].priceAtAddition = itemData.priceAtAddition;
  } else {
    cart.items.push(itemData);
  }

  return await cart.save();
};

/* ----------------------------- UPDATE ITEM QUANTITY ----------------------------- */
export const updateItem = async (userId, productId, quantity) => {
  const cart = await cartRepo.findByUser(userId);

  if (!cart) {
    throw ApiError.notFound('Cart not found / السلة غير موجودة');
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    throw ApiError.notFound('Product not found in cart / المنتج غير موجود في السلة');
  }

  if (quantity < 1) {
    throw ApiError.badRequest('Quantity must be at least 1 / الكمية يجب أن تكون 1 على الأقل');
  }

  item.quantity = quantity;

  return await cart.save();
};

/* ----------------------------- REMOVE ITEM ----------------------------- */
export const removeItem = async (userId, productId) => {
  const cart = await cartRepo.findByUser(userId);

  if (!cart) {
    throw ApiError.notFound('Cart not found / السلة غير موجودة');
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  return await cart.save();
};

/* ----------------------------- CLEAR CART ----------------------------- */
export const clearCart = async (userId) => {
  const cart = await cartRepo.findByUser(userId);

  if (!cart) {
    throw ApiError.notFound('Cart not found / السلة غير موجودة');
  }

  cart.items = [];
  return await cart.save();
};

/* ----------------------------- ADMIN ----------------------------- */
export const findById = async (id) => {
  if (!validateObjectId(id)) {
    throw ApiError.badRequest('Invalid Cart Id / رقم سلة غير صحيح');
  }

  const cart = await cartRepo.findById(id);
  if (!cart) throw ApiError.notFound('Cart not found');

  return cart;
};

export const findAll = async (filters, sort, pagination) => {
  return await cartRepo.findAll(filters, sort, pagination);
};

export const remove = async (id) => {
  const cart = await cartRepo.findById(id);
  if (!cart) throw ApiError.notFound('Cart not found');

  return await cartRepo.remove(id);
};

export const hRemove = async (id) => {
  const cart = await cartRepo.findById(id);
  if (!cart) throw ApiError.notFound('Cart not found');

  return await cartRepo.hRemove(id);
};

export const removeAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs array is required');
  }

  return await cartRepo.removeAll(ids);
};

export const hRemoveAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('IDs array is required');
  }

  return await cartRepo.hRemoveAll(ids);
};
