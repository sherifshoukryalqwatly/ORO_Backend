import * as productService from "../services/product.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import cloudinary from "../config/cloudinary.js";

export const create = asyncWrapper(async (req, res) => {
  const uploadedImages = [];

  // ✅ Upload images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(
        file,
        "products"
      );

      uploadedImages.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  // ✅ Build product data (localized fields)
  const productData = {
    title: {
      en: req.body["title.en"],
      ar: req.body["title.ar"],
    },
    description: {
      en: req.body["description.en"],
      ar: req.body["description.ar"],
    },
    ...req.body, 
    images: uploadedImages,
  };

  const product = await productService.create(productData);

  // ✅ Audit log
  await logAction({
    req,
    user: req.user,
    action: "CREATE",
    targetModel: "Product",
    targetId: product._id,
    description: `Created product with title: ${product.title.en}`,
  });

  return appResponses.success(
    res,
    product,
    "Product Created Successfully / تم إنشاء المنتج بنجاح",
    201
  );
});

export const findById = asyncWrapper(async (req, res) => {
  const product = await productService.findById(req.params.id);
  return appResponses.success(res, product);
});

export const findAll = asyncWrapper(async (req, res) => {
  const data = await productService.findAll(
    req.filters,
    req.sort,
    req.pagination
  );
  return appResponses.success(res, data);
});

export const update = asyncWrapper(async (req, res) => {
  const product = await productService.findById(req.params.id);
  if (!product) throw new Error("Product not found");

  let images = [...product.images];

  /* ------------------ 🔁 REPLACE ALL IMAGES ------------------ */
  if (req.body.replaceImages === "true") {
    // delete all old images from cloudinary
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    images = [];
  }

  /* ------------------ ➕ APPEND NEW IMAGES ------------------ */
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file, "products");

      images.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  /* ------------------ ❌ REMOVE SELECTED IMAGES ------------------ */
  if (req.body.removeImages?.length) {
    const removeList = Array.isArray(req.body.removeImages)
      ? req.body.removeImages
      : [req.body.removeImages];

    for (const public_id of removeList) {
      await cloudinary.uploader.destroy(public_id);
      images = images.filter(img => img.public_id !== public_id);
    }
  }

  /* ------------------ 🧾 UPDATE DATA ------------------ */
  const updatedData = {
    ...(req.body["title.en"] && {
      title: {
        en: req.body["title.en"],
        ar: req.body["title.ar"],
      },
    }),
    ...(req.body["description.en"] && {
      description: {
        en: req.body["description.en"],
        ar: req.body["description.ar"],
      },
    }),
    ...req.body,
    images,
  };

  const updatedProduct = await productService.update(
    req.params.id,
    updatedData
  );

  /* ------------------ 🧾 AUDIT LOG ------------------ */
  await logAction({
    req,
    user: req.user,
    action: "UPDATE",
    targetModel: "Product",
    targetId: updatedProduct._id,
    description: `Updated product: ${updatedProduct.title.en}`,
  });

  return appResponses.success(
    res,
    updatedProduct,
    "Product Updated Successfully / تم تحديث المنتج بنجاح"
  );
});

export const remove = asyncWrapper(async (req, res) => {
  await productService.remove(req.params.id);
  return appResponses.success(res, null, "Product deleted successfully");
});
