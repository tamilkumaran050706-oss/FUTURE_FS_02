const leadService = require('../services/leadService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getAllLeads = async (req, res, next) => {
  try {
    const result = await leadService.getAllLeads(req.query);
    return successResponse(res, 200, result, 'Leads fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) {
      return errorResponse(res, 404, 'Lead not found');
    }

    return successResponse(res, 200, lead, 'Lead fetched successfully');
  } catch (error) {
    next(error);
  }
};

const createLead = async (req, res, next) => {
  try {
    const lead = await leadService.createLead(req.body);
    return successResponse(res, 201, lead, 'Lead created successfully');
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    if (!lead) {
      return errorResponse(res, 404, 'Lead not found');
    }

    return successResponse(res, 200, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const deleted = await leadService.deleteLead(req.params.id);
    if (!deleted) {
      return errorResponse(res, 404, 'Lead not found');
    }

    return successResponse(res, 200, {}, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
