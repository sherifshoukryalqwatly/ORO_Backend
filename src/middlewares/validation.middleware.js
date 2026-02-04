import ApiError from '../utils/ApiError.js';

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { body, params, query } = req;

    const dataToValidate = {
      ...(Object.keys(body).length ? { body } : {}),
      ...(Object.keys(params).length ? { params } : {}),
      ...(Object.keys(query).length ? { query } : {}),
    };

    const { error } = schema.validate(dataToValidate.body || body, {
      abortEarly: false, // return all errors
      allowUnknown: false, // disallow unknown fields
      stripUnknown: true, // remove unknown fields
    });

    if (error) {
      // Combine all messages
      const messages = error.details.map((detail) => detail.message).join(', ');
      return next(ApiError.badRequest(messages));
    }

    next();
  };
};

export default validationMiddleware;
