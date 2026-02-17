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
export const addItem = async (userId, productId) => {
  if (!validateObjectId(userId)) {
    throw ApiError.badRequest('Invalid User Id / رقم مستخدم غير صحيح');
  }

  if (!validateObjectId(productId)) {
    throw ApiError.badRequest('Invalid Product Id / رقم منتج غير صحيح');
  }

  // Get product from DB
  const product = await productRepo.findById(productId);
  if (!product) {
    throw ApiError.notFound('Product not found / المنتج غير موجود');
  }

  // Find user's cart
  let cart = await cartRepo.findByUser(userId);

  const itemData = {
    product: product._id,
    productNameAtAddition: product.name,
    quantity: 1,
    priceAtAddition: product.price
  };

  // If cart doesn't exist → create new
  if (!cart) {
    return await cartRepo.create({
      user: userId,
      items: [itemData]
    });
  }

  // Check if product already exists
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Increase quantity
    cart.items[itemIndex].quantity += 1;
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


