const { body, param } = require('express-validator');

const statusValues = [
  'New',
  'Contacted',
  'Site Visit Scheduled',
  'Negotiating',
  'Closed Deal',
  'Not Interested',
];

const sourceValues = [
  'Website',
  'Referral',
  'Facebook',
  'Instagram',
  'Walk-in',
  'Property Portal',
  'Other',
];

const priorityValues = ['High', 'Medium', 'Low'];

const idParamSchema = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Lead ID must be a positive integer'),
];

const createLeadSchema = [
  body('customer_name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 3 })
    .withMessage('Customer name must be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must contain exactly 10 digits'),
  body('property_interest')
    .trim()
    .notEmpty()
    .withMessage('Property interest is required'),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isFloat({ gt: 0 })
    .withMessage('Budget must be a number greater than 0'),
  body('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(', ')}`),
  body('source')
    .optional()
    .isIn(sourceValues)
    .withMessage(`Source must be one of: ${sourceValues.join(', ')}`),
  body('priority')
    .optional()
    .isIn(priorityValues)
    .withMessage(`Priority must be one of: ${priorityValues.join(', ')}`),
  body('follow_up_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Follow-up date must be a valid date'),
  body('follow_up_time')
    .optional({ nullable: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Follow-up time must be in HH:mm format'),
];

const updateLeadSchema = [
  body('customer_name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Customer name must be at least 3 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('Phone number must contain exactly 10 digits'),
  body('property_interest')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Property interest is required when provided'),
  body('budget')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Budget must be a number greater than 0'),
  body('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(', ')}`),
  body('source')
    .optional()
    .isIn(sourceValues)
    .withMessage(`Source must be one of: ${sourceValues.join(', ')}`),
  body('priority')
    .optional()
    .isIn(priorityValues)
    .withMessage(`Priority must be one of: ${priorityValues.join(', ')}`),
  body('follow_up_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Follow-up date must be a valid date'),
  body('follow_up_time')
    .optional({ nullable: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Follow-up time must be in HH:mm format'),
];

module.exports = {
  idParamSchema,
  createLeadSchema,
  updateLeadSchema,
};
