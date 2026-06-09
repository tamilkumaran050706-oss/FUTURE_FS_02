import { useState, useEffect } from 'react';
import leadService from '../services/leadService';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Add fetchLeads and mutate hooks here

  return {
    leads,
    loading,
    error,
  };
};

export default useLeads;
