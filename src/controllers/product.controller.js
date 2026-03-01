import * as productService from "../services/product.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import cloudinary from "../config/cloudinary.js";
import { auditLogService } from "../services/auditlog.service.js";

// Helper function to log actions
const logAction = async ({ req, action, targetModel, targetId, description }) => {
    await auditLogService.createLog({
        user: req.user?.id || null,
        action,
        targetModel,
        targetId,
        description,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });
};

export const create = asyncWrapper(async (req, res) => {
  const uploadedImages = [];

  // ✅ Upload images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(
        file,
        "Products"
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
  const { id } = req.params;

  const product = await productService.findById(id);
  if (!product) {
    throw new Error("Product not found / المنتج غير موجود");
  }

  let images = [...product.images];

  /* ===========================
     🔁 REPLACE ALL IMAGES
  =========================== */
  if (req.body.replaceImages === "true") {
    const publicIds = images.map(img => img.public_id).filter(Boolean);

    if (publicIds.length) {
      await cloudinary.api.delete_resources(publicIds);
    }

    images = [];
  }

  /* ===========================
     ❌ REMOVE SELECTED IMAGES
  =========================== */
  if (req.body.removeImages) {
    const removeList = Array.isArray(req.body.removeImages)
      ? req.body.removeImages
      : [req.body.removeImages];

    for (const public_id of removeList) {
      await cloudinary.uploader.destroy(public_id);
      images = images.filter(img => img.public_id !== public_id);
    }
  }

  /* ===========================
     ➕ ADD NEW IMAGES
  =========================== */
  if (req.files?.length) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file, "Products");

      images.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  /* ===========================
     🧾 BUILD UPDATE DATA SAFELY
  =========================== */

  const updateData = {
    price: req.body.price ?? product.price,
    discount: req.body.discount ?? product.discount,
    stock: req.body.stock ?? product.stock,
    material: req.body.material ?? product.material,
    brand: req.body.brand ?? product.brand,
    category: req.body.category ?? product.category,
    isActive: req.body.isActive ?? product.isActive,
    images,
  };

  /* -------- Localized Fields -------- */
  if (
    req.body["title.en"] !== undefined ||
    req.body["title.ar"] !== undefined
  ) {
    updateData.title = {
      en: req.body["title.en"] ?? product.title.en,
      ar: req.body["title.ar"] ?? product.title.ar,
    };
  }

  if (
    req.body["description.en"] !== undefined ||
    req.body["description.ar"] !== undefined
  ) {
    updateData.description = {
      en: req.body["description.en"] ?? product.description.en,
      ar: req.body["description.ar"] ?? product.description.ar,
    };
  }

  /* ===========================
     💾 SAVE
  =========================== */

  const updatedProduct = await productService.update(id, updateData);

  /* ===========================
     🧾 AUDIT LOG
  =========================== */
  await logAction({
    req,
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

// ------------------- SOFT DELETE -------------------
export const remove = asyncWrapper(async (req, res) => {
  await productService.remove(req.params.id);
  return appResponses.success(res, null, "Product deleted successfully");
});

// ------------------- HARD DELETE -------------------
export const hRemove = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const product = await productService.findById(id);
  if (!product) {
    throw new Error("Product not found / المنتج غير موجود");
  }

  /* ---------- Delete images from Cloudinary ---------- */
  const publicIds = product.images
    ?.map(img => img.public_id)
    .filter(Boolean);

  if (publicIds.length) {
    await cloudinary.api.delete_resources(publicIds);
  }

  /* ---------- Hard delete from DB ---------- */
  await productService.hRemove(id);

  /* ---------- Audit Log ---------- */
  await logAction({
    req,
    action: "DELETE",
    targetModel: "Product",
    targetId: id,
    description: `Hard deleted product: ${product.title.en}`,
  });

  return appResponses.success(
    res,
    null,
    "Product deleted permanently / تم حذف المنتج نهائيًا"
  );
});

// ------------------- BULK SOFT DELETE -------------------
export const removeAll = asyncWrapper(async (req, res) => {
    await productService.removeAll(req.body.ids);

    await logAction({
        req,
        action: 'DELETE',
        targetModel: 'Product',
        description: `Soft deleted multiple products: ${req.body.ids.join(', ')}`
    });

    return appResponses.success(res, null, 'Products deleted successfully / تم حذف المنتجات بنجاح');
});

// ------------------- BULK HARD DELETE -------------------
export const hRemoveAll = asyncWrapper(async (req, res) => {
  const { ids } = req.body;

  const products = await productService.findAll(
    { _id: { $in: ids } },
    {},
    { skip: 0, limit: ids.length }
  );

  const publicIds = products.products
    .flatMap(p => p.images?.map(img => img.public_id))
    .filter(Boolean);

  if (publicIds.length) {
    await cloudinary.api.delete_resources(publicIds);
  }

  const result = await productService.hRemoveAll(ids);

  await logAction({
    req,
    action: "DELETE",
    targetModel: "Product",
    description: `Hard deleted products: ${ids.join(", ")}`,
  });

  return appResponses.success(
    res,
    null,
    `${result.deletedCount} Products deleted permanently / تم حذف ${result.deletedCount} منتج نهائيًا`
  );
});