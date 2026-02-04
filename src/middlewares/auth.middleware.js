import asyncWrapper from "../utils/asyncHandler.js";
import { appResponses } from "../utils/ApiResponse.js";
import { decodeToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export const isAuthenticated = asyncWrapper(async (req, res, next) => {
    // Get token (cookie or Bearer)
    let token = null;

    if (req.cookies?.access_token) {
        // cookie token
        token = req.cookies.access_token;
    } else if (req.headers?.authorization?.startsWith("Bearer ")) {
        // authorization header
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return appResponses.unauthorized(
            res,
            "User must Log In First / يجب تسجيل الدخول أولا"
        );
    }

    // Decode token
    const decoded = decodeToken(token);

    if (!decoded) {
        return appResponses.unauthorized(
            res,
            "Invalid or expired token / كود تسجيل الدخول غير صالح"
        );
    }

    // Fetch user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        return appResponses.unauthorized(
            res,
            "User not found / المستخدم غير موجود"
        );
    }

    // Attach user to request
    req.user = user;

    next();
});

export const authorizeRole = (...roles) => {
    return (req, res, next) => {        
        if (!req.user || !roles.includes(req.user.role.toUpperCase())) {
            return appResponses.forbidden(
                res,
                "Not have permissions / لا تمتلك الصلاحيات"
            );
        }
        next();
    };
};