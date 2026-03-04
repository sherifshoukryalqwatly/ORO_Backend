import * as wishlistService from '../services/wishlist.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';
import { auditLogService } from '../services/auditlog.service.js';


/* ----------------------------- HELPER ----------------------------- */
const logAction = async ({ req, action, targetId, description }) => {
    await auditLogService.createLog({
        user: req.user?.id || null,
        action,
        targetModel: 'Wishlist',
        targetId,
        description,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });
};


/* ==============================
   GET MY WISHLIST
============================== */
export const getMyWishlist = asyncWrapper(async (req, res) => {

    const wishlist = await wishlistService.getUserWishlist(req.user._id);

    await logAction({
        req,
        action: 'READ',
        targetId: wishlist?._id || null,
        description: 'Fetched user wishlist'
    });

    return appResponses.success(
        res,
        wishlist,
        'Wishlist Retrieved Successfully / تم استرجاع قائمة الأمنيات بنجاح'
    );
});


/* ==============================
   ADD ITEM
============================== */
export const addToWishlist = asyncWrapper(async (req, res) => {

    const wishlist = await wishlistService.addItem(
        req.user._id,
        req.params.productId
    );

    await logAction({
        req,
        action: 'UPDATE',
        targetId: wishlist._id,
        description: `Added product ${req.params.productId} to wishlist`
    });

    return appResponses.success(
        res,
        wishlist,
        'Item Added To Wishlist Successfully / تم إضافة العنصر لقائمة الأمنيات بنجاح'
    );
});


/* ==============================
   REMOVE ITEM
============================== */
export const removeFromWishlist = asyncWrapper(async (req, res) => {


    const wishlist = await wishlistService.removeItem(
        req.user._id,
        req.params.productId
    );

    await logAction({
        req,
        action: 'UPDATE',
        targetId: wishlist._id,
        description: `Removed product ${req.params.productId} from wishlist`
    });

    return appResponses.success(
        res,
        wishlist,
        'Item Removed From Wishlist Successfully / تم حذف العنصر من قائمة الأمنيات بنجاح'
    );
});