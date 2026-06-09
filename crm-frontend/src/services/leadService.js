// import api from './api';
import { MOCK_LEADS } from '../data/mockLeads';

const leadService = {
  /**
   * Fetch all leads from the API.
   * Template commented out; falls back to local in-memory MOCK_LEADS array.
   */
  getAllLeads: async () => {
    /* 
    try {
      const response = await api.get('/leads');
      return response.data;
    } catch (error) {
      console.error('API Error in getAllLeads:', error);
      throw error;
    }
    */
    return [...MOCK_LEADS];
  },

  /**
   * Fetch a single lead by its ID.
   */
  getLeadById: async (id) => {
    /*
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`API Error in getLeadById (${id}):`, error);
      throw error;
    }
    */
    const lead = MOCK_LEADS.find(l => l.id === Number(id));
    return lead ? { ...lead } : null;
  },

  /**
   * Create a new lead.
   */
  createLead: async (leadData) => {
    /*
    try {
      const response = await api.post('/leads', leadData);
      return response.data;
    } catch (error) {
      console.error('API Error in createLead:', error);
      throw error;
    }
    */
    const newId = MOCK_LEADS.length > 0 ? Math.max(...MOCK_LEADS.map(l => l.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];
    const newLead = {
      id: newId,
      ...leadData,
      createdAt: today,
      updatedAt: today
    };
    MOCK_LEADS.push(newLead);
    return newLead;
  },

  /**
   * Update an existing lead.
   */
  updateLead: async (id, leadData) => {
    /*
    try {
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data;
    } catch (error) {
      console.error(`API Error in updateLead (${id}):`, error);
      throw error;
    }
    */
    const idx = MOCK_LEADS.findIndex(l => l.id === Number(id));
    if (idx !== -1) {
      MOCK_LEADS[idx] = {
        ...MOCK_LEADS[idx],
        ...leadData,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return { ...MOCK_LEADS[idx] };
    }
    return null;
  },

  /**
   * Delete a lead.
   */
  deleteLead: async (id) => {
    /*
    try {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`API Error in deleteLead (${id}):`, error);
      throw error;
    }
    */
    const idx = MOCK_LEADS.findIndex(l => l.id === Number(id));
    if (idx !== -1) {
      const deleted = MOCK_LEADS.splice(idx, 1);
      return deleted[0];
    }
    return null;
  },
};

export default leadService;
