const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
  createLeadSchema,
  updateLeadSchema,
  idParamSchema,
} = require('../validators/leadValidator');

router.route('/')
  .get(leadController.getAllLeads)
  .post(validateRequest(createLeadSchema), leadController.createLead);

router.route('/:id')
  .get(validateRequest(idParamSchema), leadController.getLeadById)
  .put(validateRequest([...idParamSchema, ...updateLeadSchema]), leadController.updateLead)
  .delete(validateRequest(idParamSchema), leadController.deleteLead);

module.exports = router;
