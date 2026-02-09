import * as orderService from "../services/order.service.js";
import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";
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
    userAgent: req.headers["user-agent"]
  });
};

// CREATE ORDER
export const create = asyncWrapper(async (req, res) => {
  const order = await orderService.create({ ...req.body, user: req.user.id });

  await logAction({
    req,
    action: "CREATE",
    targetModel: "Order",
    targetId: order._id,
    description: `Created new order`
  });

  return appResponses.success(res, order, "Order Created Successfully / تم إنشاء الطلب بنجاح", 201);
});

// GET ORDER BY ID
export const findById = asyncWrapper(async (req, res) => {
  const order = await orderService.findById(req.params.id);

  await logAction({
    req,
    action: "READ",
    targetModel: "Order",
    targetId: req.params.id,
    description: "Fetched order by ID"
  });

  return appResponses.success(res, order, "Order Retrieved Successfully / تم استرداد الطلب بنجاح");
});

// GET ORDERS BY USER
export const findByUser = asyncWrapper(async (req, res) => {
  const { orders, total, pages } = await orderService.findByUser(req.user.id, req.query.filters, req.query.sort, req.query.pagination);

  await logAction({
    req,
    action: "READ",
    targetModel: "Order",
    description: `Fetched orders for user ${req.user.id} (count: ${orders.length})`
  });

  return appResponses.success(res, { data: orders, total, pages }, "User Orders Retrieved Successfully / تم استرداد طلبات المستخدم بنجاح");
});

// GET ALL ORDERS (ADMIN)
export const findAll = asyncWrapper(async (req, res) => {
  const { orders, total, pages } = await orderService.findAll(req.query.filters, req.query.sort, req.query.pagination);

  await logAction({
    req,
    action: "READ",
    targetModel: "Order",
    description: `Fetched all orders (count: ${orders.length})`
  });

  return appResponses.success(res, { data: orders, total, pages }, "Orders Retrieved Successfully / تم استرداد الطلبات بنجاح");
});

// UPDATE ORDER
export const update = asyncWrapper(async (req, res) => {
  const updatedOrder = await orderService.update(req.params.id, req.body);

  await logAction({
    req,
    action: "UPDATE",
    targetModel: "Order",
    targetId: updatedOrder._id,
    description: `Updated order`
  });

  return appResponses.success(res, updatedOrder, "Order Updated Successfully / تم تعديل الطلب بنجاح");
});

// SOFT DELETE ORDER
export const remove = asyncWrapper(async (req, res) => {
  await orderService.remove(req.params.id);

  await logAction({
    req,
    action: "DELETE",
    targetModel: "Order",
    targetId: req.params.id,
    description: "Soft deleted order"
  });

  return appResponses.success(res, null, "Order Deleted Successfully / تم حذف الطلب بنجاح");
});

// HARD DELETE ORDER
export const hRemove = asyncWrapper(async (req, res) => {
  await orderService.hRemove(req.params.id);

  await logAction({
    req,
    action: "DELETE",
    targetModel: "Order",
    targetId: req.params.id,
    description: "Hard deleted order"
  });

  return appResponses.success(res, null, "Order Deleted Permanently / تم حذف الطلب نهائياً");
});

// BULK SOFT DELETE
export const removeAll = asyncWrapper(async (req, res) => {
  await orderService.removeAll(req.body.ids);

  await logAction({
    req,
    action: "DELETE",
    targetModel: "Order",
    description: `Soft deleted multiple orders: ${req.body.ids.join(", ")}`
  });

  return appResponses.success(res, null, "Orders Deleted Successfully / تم حذف الطلبات بنجاح");
});

// BULK HARD DELETE
export const hRemoveAll = asyncWrapper(async (req, res) => {
  await orderService.hRemoveAll(req.body.ids);

  await logAction({
    req,
    action: "DELETE",
    targetModel: "Order",
    description: `Hard deleted multiple orders: ${req.body.ids.join(", ")}`
  });

  return appResponses.success(res, null, "Orders Deleted Permanently / تم حذف الطلبات نهائياً");
});
