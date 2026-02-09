import * as categoryService from '../services/categories.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import cloudinary from '../config/cloudinary.js';

/* ----------------------------- CREATE CATEGORY ----------------------------- */
export const create = asyncWrapper(async (req, res) => {
  if (!req.file) {
    throw new Error("Category image is required / صورة التصنيف مطلوبة");
  }

  const image = await uploadToCloudinary(req.file, "categories");

  const categoryData = {
    ...req.body,
    name: {
      en: req.body["name.en"],
      ar: req.body["name.ar"],
    },
    image: {
      public_id: image.public_id,
      secure_url: image.secure_url,
    },
  };

  const category = await categoryService.create(categoryData);

  return appResponses.success(
    res,
    category,
    "Category Created Successfully / تم إنشاء التصنيف بنجاح",
    201
  );
});

/* ----------------------------- GET CATEGORY ----------------------------- */
export const findById = asyncWrapper(async (req, res) => {
  const category = await categoryService.findById(req.params.id);

  return appResponses.success(
    res,
    category,
    'Category Retrieved Successfully / تم استرجاع التصنيف بنجاح'
  );
});

export const findBySlug = asyncWrapper(async (req, res) => {
  const { slug } = req.params;
  const { lang } = req.query;

  const category = await categoryService.findBySlug(slug, lang || 'en');

  return appResponses.success(
    res,
    category,
    'Category Retrieved Successfully / تم استرجاع التصنيف بنجاح'
  );
});

/* ----------------------------- GET ALL ----------------------------- */
export const findAll = asyncWrapper(async (req, res) => {
  const { filters, sort, pagination } = req.query; // يمكنك توسيع الفلاتر لاحقاً
  const result = await categoryService.findAll(filters || {}, sort || {}, pagination || {});

  return appResponses.success(
    res,
    result,
    'Categories Retrieved Successfully / تم استرجاع التصنيفات بنجاح'
  );
});

/* ----------------------------- UPDATE CATEGORY ----------------------------- */
export const update = asyncWrapper(async (req, res) => {
  const category = await categoryService.findById(req.params.id);

  if (!category) {
    throw new Error("Category not found / التصنيف غير موجود");
  }

  const updateData = {
    ...req.body,
  };

  // 🔹 localized name
  if (req.body["name.en"] || req.body["name.ar"]) {
    updateData.name = {
      en: req.body["name.en"] ?? category.name.en,
      ar: req.body["name.ar"] ?? category.name.ar,
    };
  }

  // 🔹 image update (optional)
  if (req.file) {
    // delete old image
    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    const image = await uploadToCloudinary(req.file, "categories");

    updateData.image = {
      public_id: image.public_id,
      secure_url: image.secure_url,
    };
  }

  const updatedCategory = await categoryService.update(
    req.params.id,
    updateData
  );

  return appResponses.success(
    res,
    updatedCategory,
    "Category Updated Successfully / تم تعديل التصنيف بنجاح"
  );
});

/* ----------------------------- DELETE CATEGORY ----------------------------- */
export const remove = asyncWrapper(async (req, res) => {
  await categoryService.remove(req.params.id);

  return appResponses.success(
    res,
    null,
    'Category Deleted Successfully / تم حذف التصنيف بنجاح'
  );
});

export const hRemove = asyncWrapper(async (req, res) => {
  await categoryService.hRemove(req.params.id);

  return appResponses.success(
    res,
    null,
    'Category Permanently Deleted / تم حذف التصنيف نهائيًا'
  );
});

/* ----------------------------- BULK DELETE ----------------------------- */
export const removeAll = asyncWrapper(async (req, res) => {
  await categoryService.removeAll(req.body.ids);

  return appResponses.success(
    res,
    null,
    'Categories Deleted Successfully / تم حذف التصنيفات بنجاح'
  );
});

export const hRemoveAll = asyncWrapper(async (req, res) => {
  await categoryService.hRemoveAll(req.body.ids);

  return appResponses.success(
    res,
    null,
    'Categories Permanently Deleted / تم حذف التصنيفات نهائيًا'
  );
});
