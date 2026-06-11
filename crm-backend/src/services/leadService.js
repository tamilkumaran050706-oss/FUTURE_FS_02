const Lead = require('../models/leadModel');

const getAllLeads = async (query) => {
  return Lead.findAll(query);
};

const getLeadById = async (id) => {
  return Lead.findById(id);
};

const createLead = async (leadData) => {
  return Lead.create(leadData);
};

const updateLead = async (id, leadData) => {
  return Lead.update(id, leadData);
};

const deleteLead = async (id) => {
  return Lead.delete(id);
};

module.exports = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
