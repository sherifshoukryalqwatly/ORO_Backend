import * as favouriteService from '../services/favourites.service.js';
import asyncWrapper from '../utils/asyncHandler.js';
import { appResponses } from '../utils/ApiResponse.js';
import { auditLogService } from '../services/auditlog.service.js';


/* ----------------------------- HELPER ----------------------------- */
const logAction = async ({ req, action, targetId, description }) => {
    await auditLogService.createLog({
        user: req.user?.id || null,
        action,
        targetModel: 'Favourite',
        targetId,
        description,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });
};


/* ==============================
   GET MY FAVOURITES
============================== */
export const getMyFavourites = asyncWrapper(async (req, res) => {

    const favourite = await favouriteService.getUserFavourites(req.user._id);

    await logAction({
        req,
        action: 'READ',
        targetId: favourite?._id || null,
        description: 'Fetched user favourites'
    });

    return appResponses.success(
        res,
        favourite,
        'Favourite Retrieved Successfully / تم استرجاع المفضلات بنجاح'
    );
});


/* ==============================
   ADD PRODUCT
============================== */
export const addToFavourite = asyncWrapper(async (req, res) => {

    const favourite = await favouriteService.addProduct(
        req.user._id,
        req.params.productId
    );

    await logAction({
        req,
        action: 'UPDATE',
        targetId: favourite._id,
        description: `Added product ${req.params.productId} to favourites`
    });

    return appResponses.success(
        res,
        favourite,
        'Product Added To Favourite Successfully / تم إضافة المنتج للمفضلة بنجاح'
    );
});


/* ==============================
   REMOVE PRODUCT
============================== */
export const removeFromFavourite = asyncWrapper(async (req, res) => {

    const favourite = await favouriteService.removeProduct(
        req.user._id,
        req.params.productId
    );

    await logAction({
        req,
        action: 'UPDATE',
        targetId: favourite._id,
        description: `Removed product ${req.params.productId} from favourites`
    });

    return appResponses.success(
        res,
        favourite,
        'Product Removed From Favourite Successfully / تم حذف المنتج من المفضلة بنجاح'
    );
});
