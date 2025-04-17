import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { message, Card, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LeadForm from '@/components/LeadForm';
import CustomBreadcrumb from '@/components/Breadcrumb';

const EditLead = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (id) {
      // Simulate API call to fetch lead data
      setLoading(true);
      // Replace this with actual API call
      setTimeout(() => {
        setInitialValues({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          nationality: 'US',
          visaType: ['work'],
          destinationCountry: 'US',
          inquiryDate: '2024-03-20',
          leadSource: 'website',
          additionalNotes: 'Interested in work visa',
          consent: true
        });
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call to update lead
      console.log('Updating lead with values:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Lead updated successfully');
      router.push('/dashboard/leads');
    } catch (error) {
      console.error('Error updating lead:', error);
      message.error('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { title: 'Dashboard', path: '/dashboard' },
    { title: 'Leads', path: '/dashboard/leads' },
    { title: 'Edit Lead', path: `/dashboard/leads/${id}/edit` }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <CustomBreadcrumb items={breadcrumbItems} />
      
      <Card
        title={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => router.back()}
            >
              Back
            </Button>
            <span>Edit Lead</span>
          </Space>
        }
        style={{ marginTop: '16px' }}
      >
        {initialValues ? (
          <LeadForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            loading={loading}
            isEdit={true}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Loading...
          </div>
        )}
      </Card>
    </div>
  );
};

export default EditLead; 