import ApiError from '../utils/ApiError.js';

const validationMiddleware = (schemas) => {
  return (req, res, next) => {

    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
      });

      if (error) {
        return next(
          ApiError.badRequest(
            error.details.map(e => e.message).join(', ')
          )
        );
      }

      req.body = value;
    }

    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params);

      if (error) {
        return next(
          ApiError.badRequest(
            error.details.map(e => e.message).join(', ')
          )
        );
      }

      req.params = value;
    }

    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query);

      if (error) {
        return next(
          ApiError.badRequest(
            error.details.map(e => e.message).join(', ')
          )
        );
      }

      req.query = value;
    }

    next();
  };
};

export default validationMiddleware;
