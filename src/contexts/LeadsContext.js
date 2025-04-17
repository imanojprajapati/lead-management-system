import React, { createContext, useContext, useState, useCallback } from 'react';

// Initial fake data
const initialLeads = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    nationality: 'US',
    status: 'New',
    notes: 'Initial contact made via website',
    visaType: ['student'],
    destinationCountry: 'CA',
    preferredImmigrationProgram: 'study_permit',
    inquiryDate: '2024-04-15',
    leadSource: 'website',
    additionalNotes: 'Interested in computer science programs',
    leadScore: 85,
    leadStage: 'New',
    nextFollowUpDate: '2024-04-22',
    followUpMethod: 'email',
    customFields: []
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    nationality: 'UK',
    status: 'Contacted',
    notes: 'Interested in student visa',
    visaType: ['student'],
    destinationCountry: 'US',
    preferredImmigrationProgram: 'study_permit',
    inquiryDate: '2024-04-14',
    leadSource: 'linkedin',
    additionalNotes: 'Looking for MBA programs',
    leadScore: 75,
    leadStage: 'Contacted',
    nextFollowUpDate: '2024-04-21',
    followUpMethod: 'phone',
    customFields: []
  },
  {
    id: '3',
    fullName: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 345-6789',
    nationality: 'CN',
    status: 'Doc Collected',
    notes: 'Documents submitted for review',
    visaType: ['work'],
    destinationCountry: 'AU',
    preferredImmigrationProgram: 'skilled_worker',
    inquiryDate: '2024-04-13',
    leadSource: 'referral',
    additionalNotes: 'Software engineer with 5 years experience',
    leadScore: 90,
    leadStage: 'Doc Collected',
    nextFollowUpDate: '2024-04-20',
    followUpMethod: 'email',
    customFields: []
  },
  {
    id: '4',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 456-7890',
    nationality: 'CA',
    status: 'Applied',
    notes: 'Application submitted',
    visaType: ['pr'],
    destinationCountry: 'CA',
    preferredImmigrationProgram: 'express_entry',
    inquiryDate: '2024-04-12',
    leadSource: 'website',
    additionalNotes: 'Looking for PR through Express Entry',
    leadScore: 95,
    leadStage: 'Applied',
    nextFollowUpDate: '2024-04-19',
    followUpMethod: 'whatsapp',
    customFields: []
  },
  {
    id: '5',
    fullName: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 567-8901',
    nationality: 'KR',
    status: 'New',
    notes: 'Initial inquiry about work visa',
    visaType: ['work'],
    destinationCountry: 'UK',
    preferredImmigrationProgram: 'skilled_worker',
    inquiryDate: '2024-04-11',
    leadSource: 'linkedin',
    additionalNotes: 'Tech lead with 8 years experience',
    leadScore: 80,
    leadStage: 'New',
    nextFollowUpDate: '2024-04-18',
    followUpMethod: 'email',
    customFields: []
  },
  {
    id: '6',
    fullName: 'Emma Wilson',
    email: 'emma.w@example.com',
    phone: '+1 (555) 678-9012',
    nationality: 'AU',
    status: 'Contacted',
    notes: 'Follow-up scheduled',
    visaType: ['student'],
    destinationCountry: 'US',
    preferredImmigrationProgram: 'study_permit',
    inquiryDate: '2024-04-10',
    leadSource: 'website',
    additionalNotes: 'Interested in medical programs',
    leadScore: 70,
    leadStage: 'Contacted',
    nextFollowUpDate: '2024-04-17',
    followUpMethod: 'phone',
    customFields: []
  },
  {
    id: '7',
    fullName: 'Alex Rodriguez',
    email: 'alex.r@example.com',
    phone: '+1 (555) 789-0123',
    nationality: 'MX',
    status: 'Doc Collected',
    notes: 'Documents under review',
    visaType: ['work'],
    destinationCountry: 'CA',
    preferredImmigrationProgram: 'skilled_worker',
    inquiryDate: '2024-04-09',
    leadSource: 'referral',
    additionalNotes: 'Senior developer with 6 years experience',
    leadScore: 85,
    leadStage: 'Doc Collected',
    nextFollowUpDate: '2024-04-16',
    followUpMethod: 'email',
    customFields: []
  },
  {
    id: '8',
    fullName: 'Sophie Martin',
    email: 'sophie.m@example.com',
    phone: '+1 (555) 890-1234',
    nationality: 'FR',
    status: 'Applied',
    notes: 'Application in process',
    visaType: ['pr'],
    destinationCountry: 'CA',
    preferredImmigrationProgram: 'express_entry',
    inquiryDate: '2024-04-08',
    leadSource: 'linkedin',
    additionalNotes: 'Marketing manager seeking PR',
    leadScore: 75,
    leadStage: 'Applied',
    nextFollowUpDate: '2024-04-15',
    followUpMethod: 'whatsapp',
    customFields: []
  },
  {
    id: '9',
    fullName: 'Lucas Silva',
    email: 'lucas.s@example.com',
    phone: '+1 (555) 901-2345',
    nationality: 'BR',
    status: 'New',
    notes: 'Initial contact made',
    visaType: ['student'],
    destinationCountry: 'UK',
    preferredImmigrationProgram: 'study_permit',
    inquiryDate: '2024-04-07',
    leadSource: 'website',
    additionalNotes: 'Interested in business programs',
    leadScore: 65,
    leadStage: 'New',
    nextFollowUpDate: '2024-04-14',
    followUpMethod: 'email',
    customFields: []
  },
  {
    id: '10',
    fullName: 'Anna Kowalski',
    email: 'anna.k@example.com',
    phone: '+1 (555) 012-3456',
    nationality: 'PL',
    status: 'Contacted',
    notes: 'Follow-up completed',
    visaType: ['work'],
    destinationCountry: 'AU',
    preferredImmigrationProgram: 'skilled_worker',
    inquiryDate: '2024-04-06',
    leadSource: 'referral',
    additionalNotes: 'Data scientist with 4 years experience',
    leadScore: 80,
    leadStage: 'Contacted',
    nextFollowUpDate: '2024-04-13',
    followUpMethod: 'phone',
    customFields: []
  }
];

const LeadsContext = createContext();

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState(initialLeads);
  const [loading, setLoading] = useState(false);

  const addLead = useCallback((newLead) => {
    setLeads(prevLeads => [...prevLeads, { ...newLead, id: Date.now().toString() }]);
  }, []);

  const updateLead = useCallback((id, updatedLead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => lead.id === id ? { ...lead, ...updatedLead } : lead)
    );
  }, []);

  const deleteLead = useCallback(async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNotes = useCallback(async (id, notes) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setLeads(prevLeads => 
        prevLeads.map(lead => lead.id === id ? { ...lead, notes } : lead)
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
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

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};

export default LeadsContext; 