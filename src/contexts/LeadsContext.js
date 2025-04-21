import React, { createContext, useContext, useState, useCallback } from 'react';

const LeadsContext = createContext();

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLead = useCallback(async (leadData) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const newLead = {
        id: Date.now(),
        ...leadData,
        createdAt: new Date().toISOString(),
        status: 'New',
        leadScore: 0
      };
      setLeads(prev => [...prev, newLead]);
      return newLead;
    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLead = useCallback(async (id, leadData) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, ...leadData } : lead
      ));
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLead = useCallback(async (id) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNotes = useCallback(async (id, notes) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, notes } : lead
      ));
    } catch (error) {
      console.error('Error updating notes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    leads,
    loading,
    addLead,
    updateLead,
    deleteLead,
    updateNotes
  };

  return (
    <LeadsContext.Provider value={value}>
      {children}
    </LeadsContext.Provider>
  );
};

export default LeadsContext; 