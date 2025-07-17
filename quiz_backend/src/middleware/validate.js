const ResponseUtil = require('../utils/response.util');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      return ResponseUtil.validationError(res, errors);
    }
    next();
  };
};

module.exports = validateRequest;
