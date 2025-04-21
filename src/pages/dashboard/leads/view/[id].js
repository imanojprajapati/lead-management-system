import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Typography, Descriptions, Space, Button, Tag, Divider } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  GlobalOutlined,
  CalendarOutlined,
  TeamOutlined,
  HistoryOutlined,
  EditOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useLeads } from '@/contexts/LeadsContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Status colors
const STATUS_COLORS = {
  'New': 'blue',
  'Contacted': 'orange',
  'In Progress': 'purple',
  'Followed Up': 'green',
  'Closed': 'red'
};

const LeadViewPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { leads, loading } = useLeads();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    if (id && leads) {
      const foundLead = leads.find(l => l.id === parseInt(id));
      setLead(foundLead || null);
    }
  }, [id, leads]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!lead) {
    return <div>Lead not found</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'sales']}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => router.push('/dashboard')}
              >
                Back
              </Button>
              <Title level={4} style={{ margin: 0 }}>Lead Details</Title>
            </Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => router.push(`/dashboard/leads/edit/${id}`)}
            >
              Edit Lead
            </Button>
          </Space>
        </Card>

        <Card>
          <Descriptions title="Personal Information" bordered>
            <Descriptions.Item label="Full Name">
              <Space>
                <UserOutlined style={{ color: '#1677ff' }} />
                <Text>{lead.fullName}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Space>
                <MailOutlined style={{ color: '#1677ff' }} />
                <Text>{lead.email}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              <Space>
                <PhoneOutlined style={{ color: '#1677ff' }} />
                <Text>{lead.phone}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Nationality">
              <Space>
                <GlobalOutlined style={{ color: '#1677ff' }} />
                <Text>{lead.nationality}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={STATUS_COLORS[lead.status] || 'default'}>
                {lead.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Inquiry Date">
              <Space>
                <CalendarOutlined style={{ color: '#1677ff' }} />
                <Text>{dayjs(lead.inquiryDate).format('YYYY-MM-DD')}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card>
          <Descriptions title="Visa Details" bordered>
            <Descriptions.Item label="Visa Type">
              <Text>{lead.visaType}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Destination Country">
              <Text>{lead.destinationCountry}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Preferred Immigration Program">
              <Text>{lead.preferredImmigrationProgram}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Lead Source">
              <Text>{lead.leadSource}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Lead Score">
              <Text>{lead.leadScore}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Lead Stage">
              <Text>{lead.leadStage}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card>
          <Descriptions title="Follow-up Information" bordered>
            <Descriptions.Item label="Next Follow-up Date">
              <Space>
                <CalendarOutlined style={{ color: '#1677ff' }} />
                <Text>{lead.nextFollowUpDate ? dayjs(lead.nextFollowUpDate).format('YYYY-MM-DD') : 'Not scheduled'}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Follow-up Method">
              <Space>
                <HistoryOutlined style={{ color: '#1677ff' }} />
                <Text>{lead.followUpMethod || 'Not specified'}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Assigned To">
              <Space>
                <TeamOutlined style={{ color: '#1677ff' }} />
                <Text>{lead.assignedTo || 'Not assigned'}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {lead.customFields && lead.customFields.length > 0 && (
          <Card>
            <Descriptions title="Custom Fields" bordered>
              {lead.customFields.map((field, index) => (
                <Descriptions.Item key={index} label={field.label}>
                  <Text>{field.value}</Text>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        )}

        <Card>
          <Descriptions title="Additional Notes" bordered>
            <Descriptions.Item label="Notes">
              <Text>{lead.additionalNotes || 'No additional notes'}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </ProtectedRoute>
  );
};

export default LeadViewPage; 