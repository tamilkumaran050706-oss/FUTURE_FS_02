const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');

const validateRequest = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    return errorResponse(res, 400, 'Validation failed', formattedErrors);
  }

  next();
};

module.exports = {
  validateRequest,
};
