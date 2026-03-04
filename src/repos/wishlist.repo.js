import mongoose from "mongoose";
import Wishlist from "../models/wishlist.model.js";

/* ===============================
   GET USER WISHLIST
================================= */
export const getUserWishlist = async (userId) => {
  return await Wishlist.findOne({ user: userId })
    .populate({
      path: "items.product",
      match: { isDeleted: false }
    })
    .lean();
};


/* ===============================
   ADD ITEM TO WISHLIST
================================= */
export const addItem = async (userId, productId, variantId = null) => {

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    {
      $addToSet: {
        items: {
          product: productId,
          variant: variantId
        }
      }
    },
    {
      new: true,
      upsert: true
    }
  ).populate("items.product");

  return wishlist;
};


/* ===============================
   REMOVE ITEM FROM WISHLIST
================================= */
export const removeItem = async (userId, productId, variantId = null) => {

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    {
      $pull: {
        items: {
          product: productId,
          variant: variantId
        }
      }
    },
    {
      new: true
    }
  ).populate("items.product");

  return wishlist;
};