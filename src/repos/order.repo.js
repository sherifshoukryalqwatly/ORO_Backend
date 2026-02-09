import Order from "../models/order.model.js";

// CREATE
export const create = async (data) => {
    const order = new Order(data);
    return await order.save();
};

// FIND BY ID
export const findById = async (id) => {
    return await Order.findById(id);
};

// FIND BY USER
export const findByUser = async (userId, filters = {}, sort = { createdAt: -1 }, pagination = { skip: 0, limit: 10 }) => {
    const [orders, total] = await Promise.all([
        Order.find({ user: userId, ...filters })
            .sort(sort)
            .skip(pagination.skip)
            .limit(pagination.limit),
        Order.countDocuments({ user: userId, ...filters })
    ]);

    return { orders, total };
};

// FIND ALL
export const findAll = async (filters = {}, sort = { createdAt: -1 }, pagination = { skip: 0, limit: 10 }) => {
    const [orders, total] = await Promise.all([
        Order.find(filters).sort(sort).skip(pagination.skip).limit(pagination.limit),
        Order.countDocuments(filters)
    ]);

    return { orders, total };
};

// UPDATE
export const update = async (id, newData) => {
    return await Order.findByIdAndUpdate(id, newData, { new: true });
};

// SOFT DELETE
export const remove = async (id) => {
    return await Order.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

// HARD DELETE
export const hRemove = async (id) => {
    return await Order.findByIdAndDelete(id);
};

// BULK SOFT DELETE
export const removeAll = async (ids) => {
    return await Order.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: true } }, { runValidators: true });
};

// BULK HARD DELETE
export const hRemoveAll = async (ids) => {
    return await Order.deleteMany({ _id: { $in: ids } });
};
