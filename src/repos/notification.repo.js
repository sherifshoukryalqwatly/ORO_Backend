import Notification from "../models/notification.model.js";

// ------------------- CREATE -------------------
export const create = async (data) => {
    const notification = new Notification(data);
    return await notification.save();
};

// ------------------- FIND BY ID -------------------
export const findById = async (id) => {
    return await Notification.findById(id);
};

// ------------------- FIND BY USER -------------------
export const findByUser = async (userId, filters = {}, sort = { createdAt: -1 }, pagination = {}) => {
    const query = { user: userId, isDeleted: false, ...filters };
    const [notifications, total] = await Promise.all([
        Notification.find(query)
            .sort(sort)
            .limit(pagination.limit || 10)
            .skip(pagination.skip || 0),
        Notification.countDocuments(query)
    ]);
    return { notifications, total };
};

// ------------------- FIND ALL -------------------
export const findAll = async (filters = {}, sort = { createdAt: -1 }, pagination = {}) => {
    const [notifications, total] = await Promise.all([
        Notification.find({ isDeleted: false, ...filters })
            .sort(sort)
            .limit(pagination.limit || 10)
            .skip(pagination.skip || 0),
        Notification.countDocuments({ isDeleted: false, ...filters })
    ]);
    return { notifications, total };
};

// ------------------- UPDATE -------------------
export const update = async (id, newData) => {
    return await Notification.findByIdAndUpdate(id, newData, { new: true });
};

// ------------------- SOFT DELETE -------------------
export const remove = async (id) => {
    return await Notification.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

// ------------------- HARD DELETE -------------------
export const hRemove = async (id) => {
    return await Notification.findByIdAndDelete(id);
};

// ------------------- BULK SOFT DELETE -------------------
export const removeAll = async (ids) => {
    return await Notification.updateMany(
        { _id: { $in: ids } },
        { $set: { isDeleted: true } },
        { runValidators: true }
    );
};

// ------------------- BULK HARD DELETE -------------------
export const hRemoveAll = async (ids) => {
    return await Notification.deleteMany({ _id: { $in: ids } });
};
