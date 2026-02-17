import * as notificationRepo from "../repos/notification.repo.js";
import ApiError from "../utils/ApiError.js";
import { globalRegex } from "../utils/constants.js";
import { notificationFilters, notificationPagination, notificationSort } from "../utils/filter_sort_pagination.js";

// ------------------- CREATE -------------------
export const create = async (data) => {
    return await notificationRepo.create(data);
};

// ------------------- FIND BY ID -------------------
export const findById = async (id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw ApiError.badRequest("Invalid Notification Id / Id الإشعار غير صالح");
    }

    const notification = await notificationRepo.findById(id);
    if (!notification) throw ApiError.notFound("Notification not found / الإشعار غير موجود");

    return notification;
};

// ------------------- FIND BY USER -------------------
export const findByUser = async (userId, query = {}) => {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw ApiError.badRequest("Invalid User Id / Id المستخدم غير صالح");
    }
    const filters = notificationFilters(query);
    const sort = notificationSort(query);
    const pagination = notificationPagination(query);

    const { notifications, total } = await notificationRepo.findByUser(userId, filters, sort,  pagination);
    const pages = Math.ceil(total / pagination.limit);

    return { notifications, total, pages };
};
/* ----------------------------- GET ALL ----------------------------- */
export const findAll = async (filters = {}, sort = {}, pagination = {}) => {
  return await notificationRepo.findAll(filters, sort, pagination);
};
// ------------------- UPDATE -------------------
export const update = async (id, newData) => {
    const notification = await findById(id);
    return await notificationRepo.update(notification._id, newData);
};

// ------------------- SOFT DELETE -------------------
export const remove = async (id) => {
    const notification = await findById(id);
    return await notificationRepo.remove(notification._id);
};

// ------------------- HARD DELETE -------------------
export const hRemove = async (id) => {
    const notification = await findById(id);
    return await notificationRepo.hRemove(notification._id);
};

// ------------------- BULK SOFT DELETE -------------------
export const removeAll = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw ApiError.badRequest("IDs Array is Required / مصفوفة Ids مطلوبة");
    }

    const objIds = ids.filter(id => id.match(/^[0-9a-fA-F]{24}$/));
    return await notificationRepo.removeAll(objIds);
};

// ------------------- BULK HARD DELETE -------------------
export const hRemoveAll = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw ApiError.badRequest("IDs Array is Required / مصفوفة Ids مطلوبة");
    }

    const objIds = ids.filter(id => id.match(/^[0-9a-fA-F]{24}$/));
    return await notificationRepo.hRemoveAll(objIds);
};
