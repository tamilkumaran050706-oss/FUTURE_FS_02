const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
// TODO: Import validation middleware

router.route('/')
  .get(leadController.getAllLeads)
  .post(leadController.createLead);

router.route('/:id')
  .get(leadController.getLeadById)
  .put(leadController.updateLead)
  .delete(leadController.deleteLead);

module.exports = router;
