import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Card, Typography, Form, Input, Select, Button, Space, message, Row, Col, Divider, Modal, Empty, Checkbox, InputNumber, DatePicker, Switch, Tag } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Configure dayjs to handle all date formats
dayjs.locale('en');

const { Title } = Typography;
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
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    nationality: 'UK',
    status: 'Contacted',
    notes: 'Interested in student visa',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    phone: '+1 (555) 345-6789',
    nationality: 'CA',
    status: 'Qualified',
    notes: 'Ready for application process',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '+1 (555) 456-7890',
    nationality: 'AU',
    status: 'Lost',
    notes: 'Chose another agency',
  },
];

// Constants for form options
const NATIONALITY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' }
];

const VISA_TYPE_OPTIONS = [
  { value: 'student', label: 'Student Visa' },
  { value: 'work', label: 'Work Visa' },
  { value: 'business', label: 'Business Visa' },
  { value: 'family', label: 'Family Visa' },
  { value: 'permanent', label: 'Permanent Residence' }
];

const DESTINATION_COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'NZ', label: 'New Zealand' }
];

const IMMIGRATION_PROGRAM_OPTIONS = [
  { value: 'study_permit', label: 'Study Permit' },
  { value: 'work_permit', label: 'Work Permit' },
  { value: 'business_immigration', label: 'Business Immigration' },
  { value: 'family_sponsorship', label: 'Family Sponsorship' },
  { value: 'express_entry', label: 'Express Entry' }
];

const LEAD_SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'email_campaign', label: 'Email Campaign' },
  { value: 'event', label: 'Event' }
];

const LEAD_STAGE_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Proposal', label: 'Proposal' },
  { value: 'Negotiation', label: 'Negotiation' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Lost', label: 'Lost' }
];

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' }
];

const FOLLOW_UP_METHOD_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'video_call', label: 'Video Call' },
  { value: 'in_person', label: 'In Person' }
];

const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number Input' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'date', label: 'Date Picker' },
  { value: 'switch', label: 'Switch/Toggle' }
];

const EditLeadPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [isCustomFieldModalVisible, setIsCustomFieldModalVisible] = useState(false);
  const [customFieldForm] = Form.useForm();
  const [editingCustomField, setEditingCustomField] = useState(null);
  const [lead, setLead] = useState(null);
  const [newField, setNewField] = useState({
    type: 'text',
    name: '',
    label: '',
    placeholder: '',
    required: false
  });

  // Helper function to safely convert string dates to dayjs objects
  const convertToDayjs = useCallback((dateString) => {
    if (!dateString) return null;
    const date = dayjs(dateString);
    return date.isValid() ? date : null;
  }, []);

  // Format lead data with proper date objects
  const formatLeadData = useCallback((leadData) => {
    if (!leadData) return null;
    
    const formattedLead = {
      ...leadData,
      inquiryDate: convertToDayjs(leadData.inquiryDate),
      nextFollowUpDate: convertToDayjs(leadData.nextFollowUpDate)
    };
    
    // Also convert dates in custom fields if they exist
    if (formattedLead.customFields && formattedLead.customFields.length > 0) {
      formattedLead.customFields = formattedLead.customFields.map(field => {
        if (field.type === 'date' && field.value) {
          return {
            ...field,
            value: convertToDayjs(field.value)
          };
        }
        return field;
      });
    }
    
    return formattedLead;
  }, [convertToDayjs]);

  // Load lead data
  useEffect(() => {
    if (id) {
      const foundLead = initialLeads.find(l => l.id === id);
      if (foundLead) {
        const formattedLead = formatLeadData(foundLead);
        setLead(formattedLead);
        
        // Set form values after a short delay to ensure the form is ready
        setTimeout(() => {
          form.setFieldsValue(formattedLead);
        }, 0);
      } else {
        message.error('Lead not found');
        router.push('/dashboard/leads');
      }
      setLoading(false);
    }
  }, [id, form, router, formatLeadData]);

  // Format form values for submission
  const formatFormValues = useCallback((values) => {
    const formattedValues = {
      ...values,
      inquiryDate: values.inquiryDate ? values.inquiryDate.format('YYYY-MM-DD') : null,
      nextFollowUpDate: values.nextFollowUpDate ? values.nextFollowUpDate.format('YYYY-MM-DD') : null
    };
    
    // Also format dates in custom fields
    if (formattedValues.customFields && formattedValues.customFields.length > 0) {
      formattedValues.customFields = formattedValues.customFields.map(field => {
        if (field.type === 'date' && field.value) {
          return {
            ...field,
            value: field.value.format('YYYY-MM-DD')
          };
        }
        return field;
      });
    }
    
    return formattedValues;
  }, []);

  const handleSubmit = useCallback(async (values) => {
    try {
      setLoading(true);
      
      // Convert dayjs objects back to string format for API submission
      const formattedValues = formatFormValues(values);
      
      // In a real application, this would be an API call
      console.log('Submitting formatted values:', formattedValues);
      message.success('Lead updated successfully');
      router.push('/dashboard/leads');
    } catch (error) {
      console.error('Error updating lead:', error);
      message.error('Failed to update lead');
    } finally {
      setLoading(false);
    }
  }, [formatFormValues, router]);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => !prev);
  }, []);

  const showCustomFieldModal = useCallback((field = null) => {
    setEditingCustomField(field);
    if (field) {
      customFieldForm.setFieldsValue(field);
      setNewField({
        type: field.type || 'text',
        name: field.name || '',
        label: field.label || '',
        placeholder: field.placeholder || '',
        required: field.required || false
      });
    } else {
      customFieldForm.resetFields();
      setNewField({
        type: 'text',
        name: '',
        label: '',
        placeholder: '',
        required: false
      });
    }
    setIsCustomFieldModalVisible(true);
  }, [customFieldForm]);

  const handleCustomFieldOk = useCallback(() => {
    if (!newField.name || !newField.label) {
      message.error('Field name and label are required');
      return;
    }

    // Check for duplicate field names
    if (lead.customFields && lead.customFields.some(field => 
      field.name === newField.name && (!editingCustomField || field.id !== editingCustomField.id)
    )) {
      message.error('Field name must be unique');
      return;
    }

    const updatedLead = { ...lead };
    
    if (editingCustomField) {
      // Update existing custom field
      updatedLead.customFields = updatedLead.customFields.map(field => 
        field.id === editingCustomField.id ? { ...field, ...newField } : field
      );
    } else {
      // Add new custom field
      const newCustomField = {
        id: `cf${Date.now()}`,
        ...newField,
        value: newField.type === 'date' ? null : '' // Initialize with empty value
      };
      updatedLead.customFields = [...(updatedLead.customFields || []), newCustomField];
    }
    
    setLead(updatedLead);
    form.setFieldsValue(updatedLead);
    setIsCustomFieldModalVisible(false);
    message.success(`Custom field ${editingCustomField ? 'updated' : 'added'} successfully`);
  }, [editingCustomField, form, lead, newField]);

  const handleDeleteCustomField = useCallback((fieldId) => {
    const updatedLead = { ...lead };
    updatedLead.customFields = updatedLead.customFields.filter(field => field.id !== fieldId);
    setLead(updatedLead);
    form.setFieldsValue(updatedLead);
    message.success('Custom field deleted successfully');
  }, [form, lead]);

  const renderCustomField = useCallback((field) => {
    const commonProps = {
      placeholder: field.placeholder,
      style: { width: '100%' }
    };

    switch (field.type) {
      case 'text':
        return <Input {...commonProps} />;
      case 'textarea':
        return <TextArea {...commonProps} rows={4} />;
      case 'number':
        return <InputNumber {...commonProps} style={{ width: '100%' }} />;
      case 'select':
        return (
          <Select {...commonProps}>
            <Option value="option1">Option 1</Option>
            <Option value="option2">Option 2</Option>
          </Select>
        );
      case 'date':
        return <DatePicker {...commonProps} style={{ width: '100%' }} />;
      case 'switch':
        return <Switch {...commonProps} />;
      default:
        return <Input {...commonProps} />;
    }
  }, []);

  // Memoize the custom fields section to prevent unnecessary re-renders
  const customFieldsSection = useMemo(() => {
    if (!lead) return null;
    
    return (
      <>
        <Divider />
        <Row>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={4}>Custom Fields</Title>
              {!viewMode && (
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  onClick={() => showCustomFieldModal()}
                >
                  Add Custom Field
                </Button>
              )}
            </div>
            
            {lead.customFields && lead.customFields.length > 0 ? (
              <Row gutter={[16, 16]}>
                {lead.customFields.map(field => (
                  <Col span={12} key={field.id}>
                    <Form.Item
                      name={field.name}
                      label={
                        <Space>
                          {field.label}
                          {!viewMode && (
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteCustomField(field.id)}
                            />
                          )}
                        </Space>
                      }
                      rules={[{ required: field.required, message: `Please enter ${field.label.toLowerCase()}` }]}
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
      </>
    );
  }, [lead, viewMode, showCustomFieldModal, handleDeleteCustomField, renderCustomField]);

  // Memoize the custom field modal to prevent unnecessary re-renders
  const customFieldModal = useMemo(() => {
    return (
      <Modal
        title={editingCustomField ? "Edit Custom Field" : "Add Custom Field"}
        open={isCustomFieldModalVisible}
        onOk={handleCustomFieldOk}
        onCancel={() => setIsCustomFieldModalVisible(false)}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item
            label="Field Type"
            required
          >
            <Select
              value={newField.type}
              onChange={(value) => setNewField(prev => ({ ...prev, type: value }))}
              placeholder="Select field type"
            >
              {FIELD_TYPE_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Field Name"
            required
            help="Unique identifier for the field (e.g., customField1)"
          >
            <Input
              value={newField.name}
              onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter field name"
            />
          </Form.Item>

          <Form.Item
            label="Field Label"
            required
            help="Display label for the field"
          >
            <Input
              value={newField.label}
              onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Enter field label"
            />
          </Form.Item>

          <Form.Item
            label="Placeholder"
          >
            <Input
              value={newField.placeholder}
              onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
              placeholder="Enter placeholder text"
            />
          </Form.Item>

          <Form.Item
            valuePropName="checked"
          >
            <Checkbox
              checked={newField.required}
              onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
            >
              Required Field
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    );
  }, [editingCustomField, isCustomFieldModalVisible, handleCustomFieldOk, newField]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/dashboard/leads')}
        >
          Back to Leads
        </Button>
        <Button
          icon={<EyeOutlined />}
          onClick={toggleViewMode}
          type={viewMode ? 'primary' : 'default'}
        >
          {viewMode ? 'Edit Mode' : 'View Mode'}
        </Button>
      </Space>

      <Card>
        <Title level={2} style={{ marginBottom: '24px' }}>
          {viewMode ? 'View Lead Details' : 'Edit Lead'}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: '100%' }}
          disabled={viewMode}
          initialValues={lead}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Title level={4}>Personal Information</Title>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: 'Please enter the full name' },
                  { min: 2, message: 'Name must be at least 2 characters' }
                ]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter the email address' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter the phone number' },
                  { pattern: /^\+?[1-9]\d{1,14}$/, message: 'Please enter a valid phone number' }
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                name="nationality"
                label="Nationality"
                rules={[{ required: true, message: 'Please select nationality' }]}
              >
                <Select placeholder="Select nationality">
                  {NATIONALITY_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Title level={4}>Visa Information</Title>
              <Form.Item
                name="visaType"
                label="Visa Type"
                rules={[{ required: true, message: 'Please select at least one visa type' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select visa types"
                  style={{ width: '100%' }}
                >
                  {VISA_TYPE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="destinationCountry"
                label="Destination Country"
                rules={[{ required: true, message: 'Please select destination country' }]}
              >
                <Select placeholder="Select destination country">
                  {DESTINATION_COUNTRY_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="preferredImmigrationProgram"
                label="Preferred Immigration Program"
                rules={[{ required: true, message: 'Please select immigration program' }]}
              >
                <Select placeholder="Select immigration program">
                  {IMMIGRATION_PROGRAM_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="inquiryDate"
                label="Inquiry Date"
                rules={[{ required: true, message: 'Please select inquiry date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
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
                rules={[{ required: true, message: 'Please select lead source' }]}
              >
                <Select placeholder="Select lead source">
                  {LEAD_SOURCE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="leadScore"
                label="Lead Score"
                rules={[{ required: true, message: 'Please enter lead score' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  placeholder="Enter lead score (0-100)"
                />
              </Form.Item>

              <Form.Item
                name="leadStage"
                label="Lead Stage"
                rules={[{ required: true, message: 'Please select lead stage' }]}
              >
                <Select placeholder="Select lead stage">
                  {LEAD_STAGE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  {STATUS_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Title level={4}>Follow-up Information</Title>
              <Form.Item
                name="nextFollowUpDate"
                label="Next Follow-up Date"
                rules={[{ required: true, message: 'Please select next follow-up date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="followUpMethod"
                label="Follow-up Method"
                rules={[{ required: true, message: 'Please select follow-up method' }]}
              >
                <Select placeholder="Select follow-up method">
                  {FOLLOW_UP_METHOD_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="additionalNotes"
                label="Additional Notes"
                rules={[{ required: true, message: 'Please enter additional notes' }]}
              >
                <TextArea rows={4} placeholder="Enter additional notes about the lead" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item
            name="notes"
            label="Notes"
            rules={[{ required: true, message: 'Please enter notes' }]}
          >
            <TextArea rows={4} placeholder="Enter notes about the lead" />
          </Form.Item>

          {/* Custom Fields Section */}
          {customFieldsSection}

          {!viewMode && (
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Lead
                </Button>
                <Button onClick={() => router.push('/dashboard/leads')}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          )}
        </Form>
      </Card>

      {/* Add Custom Field Modal */}
      {customFieldModal}
    </div>
  );
};

export default EditLeadPage; 