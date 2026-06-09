// TODO: Import leadService

// @desc    Get all leads
// @route   GET /api/leads
// @access  Public
const getAllLeads = async (req, res, next) => {
  try {
    // TODO: Implement getting all leads
    res.status(200).json({ message: 'GET /api/leads - TODO' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Public
const getLeadById = async (req, res, next) => {
  try {
    // TODO: Implement getting lead by ID
    res.status(200).json({ message: `GET /api/leads/${req.params.id} - TODO` });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res, next) => {
  try {
    // TODO: Implement creating a new lead
    res.status(201).json({ message: 'POST /api/leads - TODO' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Public
const updateLead = async (req, res, next) => {
  try {
    // TODO: Implement updating a lead
    res.status(200).json({ message: `PUT /api/leads/${req.params.id} - TODO` });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Public
const deleteLead = async (req, res, next) => {
  try {
    // TODO: Implement deleting a lead
    res.status(200).json({ message: `DELETE /api/leads/${req.params.id} - TODO` });
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
