import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Typography, Descriptions, Button, Space, Tag, Divider } from 'antd';
import { 
  EditOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import CustomBreadcrumb from '@/components/Breadcrumb';
import LeadForm from '../../../components/LeadForm';
import { message } from 'antd';

const { Title } = Typography;

const LeadDetailPage = () => {
  const router = useRouter();
  const { id, mode } = router.query;
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real application, this would be an API call
      // For now, we'll use localStorage to get the lead data
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      const foundLead = leads.find(l => l.id === id);
      if (foundLead) {
        setLead(foundLead);
      } else {
        message.error('Lead not found');
        router.push('/dashboard/leads');
      }
      setLoading(false);
    }
  }, [id, router]);

  const handleSubmit = async (values) => {
    try {
      // In a real application, this would be an API call
      // For now, we'll update localStorage
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      const updatedLeads = leads.map(l => 
        l.id === id ? { ...l, ...values } : l
      );
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
      message.success('Lead updated successfully');
      router.push('/dashboard/leads');
    } catch (error) {
      message.error('Failed to update lead');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'green';
      case 'Contacted':
        return 'blue';
      case 'In Progress':
        return 'orange';
      case 'Followed Up':
        return 'purple';
      case 'Closed':
        return 'red';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!lead) {
    return <div>Lead not found</div>;
  }

  return (
    <>
      <CustomBreadcrumb />
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push('/dashboard/leads')}
          >
            Back to Leads
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/leads/${id}/edit`)}
          >
            Edit Lead
          </Button>
        </Space>

        <Title level={2} style={{ marginBottom: 24 }}>
          Lead Details
          <Tag color={getStatusColor(lead.status)} style={{ marginLeft: 16 }}>
            {lead.status}
          </Tag>
        </Title>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="Full Name" span={1}>
            <Space>
              <UserOutlined />
              {lead.name}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={1}>
            <Space>
              <MailOutlined />
              {lead.email}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={1}>
            <Space>
              <PhoneOutlined />
              {lead.phone}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Nationality" span={1}>
            <Space>
              <GlobalOutlined />
              {lead.nationality}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Current Location" span={1}>
            <Space>
              <GlobalOutlined />
              {lead.currentLocation}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Inquiry Date" span={1}>
            <Space>
              <CalendarOutlined />
              {lead.inquiryDate}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Visa Type" span={1}>
            {lead.visaType}
          </Descriptions.Item>
          <Descriptions.Item label="Immigration Program" span={1}>
            {lead.immigrationProgram}
          </Descriptions.Item>
          <Descriptions.Item label="Lead Source" span={1}>
            {lead.leadSource}
          </Descriptions.Item>
          <Descriptions.Item label="Follow-up Method" span={1}>
            {lead.followUpMethod}
          </Descriptions.Item>
          <Descriptions.Item label="Additional Notes" span={2}>
            {lead.additionalNotes}
          </Descriptions.Item>
        </Descriptions>

        <LeadForm
          initialValues={lead}
          onSubmit={handleSubmit}
          isEdit={mode === 'edit'}
          isViewMode={mode === 'view'}
        />
      </Card>
    </>
  );
};

export default LeadDetailPage; 