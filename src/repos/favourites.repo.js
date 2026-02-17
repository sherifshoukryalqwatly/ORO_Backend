import mongoose from "mongoose";
import Favourite from "../models/favourites.model.js";

/* ===============================
   GET USER FAVOURITES
================================= */
export const getUserFavourites = async (userId) => {
  return await Favourite.findOne({ user: userId })
    .populate("products");
};


/* ===============================
   ADD PRODUCT TO FAVOURITES
================================= */
export const addProduct = async (userId, productId) => {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid Product Id");
  }

  const favourite = await Favourite.findOneAndUpdate(
    { user: userId },
    {
      $addToSet: { products: productId } // prevents duplicates
    },
    {
      new: true,
      upsert: true // creates doc if not exists
    }
  ).populate("products");

  return favourite;
};


/* ===============================
   REMOVE PRODUCT FROM FAVOURITES
================================= */
export const removeProduct = async (userId, productId) => {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid Product Id");
  }

  const favourite = await Favourite.findOneAndUpdate(
    { user: userId },
    {
      $pull: { products: productId }
    },
    {
      new: true
    }
  ).populate("products");

  return favourite;
};
