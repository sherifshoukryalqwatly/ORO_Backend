import { StatusCodes } from "./constants.js";

class ApiError extends Error {

    constructor(message, statusCode, httpStatusText) {
        super(message);
        this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        this.httpStatusText = httpStatusText || "error";
        Error.captureStackTrace(this, this.constructor);
    }

    static createError(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, httpStatusText = "error") {
        return new ApiError(message, statusCode, httpStatusText);
    }

    static badRequest(message = "Bad Request") {
        return new ApiError(message, StatusCodes.BAD_REQUEST, "fail");
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiError(message, StatusCodes.UNAUTHORIZED, "fail");
    }

    static forbidden(message = "Forbidden") {
        return new ApiError(message, StatusCodes.FORBIDDEN, "fail");
    }

    static notFound(message = "Not Found") {
        return new ApiError(message, StatusCodes.NOT_FOUND, "fail");
    }

    static conflict(message = "Conflict") {
        return new ApiError(message, StatusCodes.CONFLICT, "fail");
    }

    static unprocessableEntity(message = "Unprocessable Entity") {
        return new ApiError(message, StatusCodes.UNPROCESSABLE_ENTITY, "fail");
    }

    static internal(message = "Internal Server Error") {
        return new ApiError(message, StatusCodes.INTERNAL_SERVER_ERROR, "error");
    }

    static serviceUnavailable(message = "Service Unavailable") {
        return new ApiError(message, StatusCodes.SERVICE_UNAVAILABLE, "error");
    }
}

export default ApiError;