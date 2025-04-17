import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Typography, Form, Input, Select, Button, Space, message, Row, Col, Divider, Empty, Tag, Modal } from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import FollowUpModal from '@/components/FollowUpModal';
import FollowUpTimeline from '@/components/FollowUpTimeline';
import LeadStatusTracker from '@/components/LeadStatusTracker';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Sample data - same as in LeadsList
const initialLeads = [
  {
    id: '1',
    name: 'John Doe',
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
  }
];

// Sample staff members data - replace with actual data from your backend
const SAMPLE_STAFF_MEMBERS = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' }
];

const ViewLeadPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      const foundLead = initialLeads.find(l => l.id === id);
      if (foundLead) {
        setLead(foundLead);
        form.setFieldsValue(foundLead);
      } else {
        message.error('Lead not found');
        router.push('/dashboard/leads');
      }
      setLoading(false);

      // Fetch follow-ups
      // Replace with actual API call
      setFollowUps([
        {
          id: 1,
          date: '2024-04-17T10:00:00Z',
          method: 'call',
          notes: 'Initial contact made',
          status: 'completed',
          assignedToName: 'John Doe'
        },
        // ... other follow-ups
      ]);
    }
  }, [id, form, router]);

  const handleDelete = () => {
    message.success('Lead deleted successfully');
    router.push('/dashboard/leads');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'blue';
      case 'Contacted':
        return 'orange';
      case 'Qualified':
        return 'green';
      case 'Lost':
        return 'red';
      default:
        return 'default';
    }
  };

  const renderCustomField = (field) => {
    const commonProps = {
      value: field.value,
      style: { 
        width: '100%',
        backgroundColor: '#f5f5f5',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        padding: '4px 11px',
        color: 'rgba(0, 0, 0, 0.85)'
      }
    };

    switch (field.type) {
      case 'text':
        return <Input {...commonProps} readOnly />;
      case 'textarea':
        return <TextArea {...commonProps} rows={4} readOnly />;
      case 'number':
        return <Input {...commonProps} readOnly />;
      case 'select':
        return <Input {...commonProps} readOnly />;
      case 'date':
        return <Input {...commonProps} readOnly />;
      case 'switch':
        return <Input {...commonProps} readOnly />;
      default:
        return <Input {...commonProps} readOnly />;
    }
  };

  const handleAddFollowUp = () => {
    setIsFollowUpModalVisible(true);
  };

  const handleSaveFollowUp = async (followUpData) => {
    try {
      // Replace with actual API call
      const newFollowUp = {
        ...followUpData,
        id: followUps.length + 1,
        assignedToName: SAMPLE_STAFF_MEMBERS.find(s => s.id === followUpData.assignedTo)?.name
      };
      
      setFollowUps([newFollowUp, ...followUps]);
    } catch (error) {
      console.error('Error saving follow-up:', error);
    }
  };

  const handleStageChange = async (newStage) => {
    try {
      // Replace with actual API call
      const updatedLead = {
        ...lead,
        leadStage: newStage,
        lastUpdated: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      setLead(updatedLead);
      message.success('Lead stage updated successfully');
    } catch (error) {
      message.error('Failed to update lead stage');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push('/dashboard/leads')}
          >
            Back to Leads
          </Button>
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => router.push(`/dashboard/leads/edit/${id}`)}
            >
              Edit Lead
            </Button>
            <Button 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Lead
            </Button>
          </Space>
        </Space>

        <LeadStatusTracker
          currentStage={lead?.leadStage || 'new'}
          onStageChange={handleStageChange}
          leadScore={lead?.leadScore || 0}
          lastUpdated={lead?.lastUpdated || dayjs().format('YYYY-MM-DD HH:mm:ss')}
        />

        <Card>
          <Title level={2} style={{ marginBottom: '24px' }}>
            View Lead Details
          </Title>

          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: '100%' }}
            disabled={true}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Title level={4}>Personal Information</Title>
                <Form.Item
                  name="name"
                  label="Full Name"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="nationality"
                  label="Nationality"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Title level={4}>Visa Information</Title>
                <Form.Item
                  name="visaType"
                  label="Visa Type"
                >
                  <div style={{ backgroundColor: '#f5f5f5', padding: '4px 11px', borderRadius: '4px' }}>
                    {lead?.visaType?.map((type, index) => (
                      <Tag key={index}>{type}</Tag>
                    ))}
                  </div>
                </Form.Item>

                <Form.Item
                  name="destinationCountry"
                  label="Destination Country"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="preferredImmigrationProgram"
                  label="Preferred Immigration Program"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="inquiryDate"
                  label="Inquiry Date"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={24}>
              <Col span={12}>
                <Title level={4}>Lead Information</Title>
                <Form.Item
                  name="leadSource"
                  label="Lead Source"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="leadScore"
                  label="Lead Score"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="leadStage"
                  label="Lead Stage"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Status"
                >
                  <Tag color={getStatusColor(lead?.status)}>{lead?.status}</Tag>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Title level={4}>Follow-up Information</Title>
                <Form.Item
                  name="nextFollowUpDate"
                  label="Next Follow-up Date"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="followUpMethod"
                  label="Follow-up Method"
                >
                  <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item
                  name="additionalNotes"
                  label="Additional Notes"
                >
                  <TextArea rows={4} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item
              name="notes"
              label="Notes"
            >
              <TextArea rows={4} readOnly style={{ backgroundColor: '#f5f5f5' }} />
            </Form.Item>

            {/* Custom Fields Section */}
            <Divider />
            <Row>
              <Col span={24}>
                <Title level={4}>Custom Fields</Title>
                
                {lead?.customFields && lead.customFields.length > 0 ? (
                  <Row gutter={[16, 16]}>
                    {lead.customFields.map(field => (
                      <Col span={12} key={field.id}>
                        <Form.Item
                          name={field.name}
                          label={field.label}
                        >
                          {renderCustomField(field)}
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Empty description="No custom fields added" />
                )}
              </Col>
            </Row>
          </Form>
        </Card>

        <FollowUpTimeline 
          followUps={followUps}
          onAddFollowUp={handleAddFollowUp}
        />

        <FollowUpModal
          visible={isFollowUpModalVisible}
          onCancel={() => setIsFollowUpModalVisible(false)}
          onSave={handleSaveFollowUp}
          leadId={id}
          leadName={lead?.name}
          staffMembers={SAMPLE_STAFF_MEMBERS}
        />

        <Modal
          title="Delete Lead"
          open={showDeleteModal}
          onOk={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        >
          <p>Are you sure you want to delete this lead? This action cannot be undone.</p>
        </Modal>
      </Space>
    </div>
  );
};

export default ViewLeadPage; 