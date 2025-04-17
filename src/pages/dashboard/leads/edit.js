import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, message, Spin } from 'antd';
import LeadForm from '@/components/LeadForm';

const EditLead = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/leads/${id}`);
        if (!response.ok) {
          throw new Error('Lead not found');
        }
        const data = await response.json();
        setLead(data);
      } catch (error) {
        message.error('Lead not found');
        router.push('/dashboard/leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id, router]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <Card title="Edit Lead">
      <LeadForm
        initialValues={lead}
        loading={loading}
        isEdit={true}
      />
    </Card>
  );
};

export default EditLead; 