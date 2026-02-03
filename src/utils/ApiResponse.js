import { StatusCodes } from "./constants.js";

export const appResponses = {
    success: (res, data = {}, message = 'Success', statusCode = StatusCodes.OK) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },
  error: (res, message = 'Something went wrong', statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  },
  notFound: (res, message = 'Resource not found') => {
    return res.status(404).json({
      success: false,
      message
    });
  },
  validationError: (res, errors = {}, message = 'Validation error') => {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message,
      errors
    });
  },
  unauthorized: (res, message = 'Unauthorized') => {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message
    });
  },
  forbidden: (res, message = 'Forbidden') => {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message
    });
  },
   badRequest: (res, message = 'badRequest') => {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message
    });
  },
  conflict: (res, message = 'Conflict') => {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message
    });
  }
}