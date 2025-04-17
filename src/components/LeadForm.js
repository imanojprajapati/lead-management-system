import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Typography, 
  message, 
  Row, 
  Col, 
  DatePicker, 
  Upload, 
  Checkbox,
  Divider,
  Steps,
  Modal,
  Space,
  InputNumber,
  Switch,
  Spin,
  Tag,
  Empty
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  GlobalOutlined, 
  EnvironmentOutlined,
  UploadOutlined,
  FileOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TagOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { InboxOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Step } = Steps;

// Move constants outside component to prevent recreation on each render
const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'RU', label: 'Russia' },
  { value: 'ZA', label: 'South Africa' },
];

const VISA_TYPES = [
  { value: 'student', label: 'Student Visa' },
  { value: 'work', label: 'Work Visa' },
  { value: 'tourist', label: 'Tourist Visa' },
  { value: 'pr', label: 'Permanent Residence' },
  { value: 'investor', label: 'Investor Visa' },
];

const IMMIGRATION_PROGRAMS = [
  { value: 'express_entry', label: 'Express Entry' },
  { value: 'skilled_worker', label: 'Skilled Worker' },
  { value: 'study_permit', label: 'Study Permit' },
  { value: 'work_permit', label: 'Work Permit' },
  { value: 'business_immigration', label: 'Business Immigration' },
];

const LEAD_SOURCES = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'walk_in', label: 'Walk-in' },
];

const FOLLOW_UP_METHODS = [
  { value: 'phone', label: 'Phone Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'in_person', label: 'In-person' },
];

const LEAD_STAGES = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Doc Collected', label: 'Doc Collected' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Closed', label: 'Closed' },
];

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number Input' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'date', label: 'Date Picker' },
  { value: 'switch', label: 'Switch/Toggle' },
];

const REQUIRED_FIELDS = {
  fullName: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  nationality: 'Nationality',
  visaType: 'Visa Type',
  destinationCountry: 'Destination Country',
  inquiryDate: 'Inquiry Date',
  leadSource: 'Lead Source',
  followUpMethod: 'Follow-up Method'
};

const LeadForm = ({ 
  initialValues = {}, 
  onSubmit = async (values) => {
    console.log('Form submitted with values:', values);
    return Promise.resolve();
  }, 
  loading = false, 
  isEdit = false,
  isViewMode = false
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [customFields, setCustomFields] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showOtherNationality, setShowOtherNationality] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newField, setNewField] = useState({
    type: 'text',
    name: '',
    label: '',
    placeholder: '',
    required: false
  });
  const [fileList, setFileList] = useState([]);
  const [destinationCountry, setDestinationCountry] = useState(initialValues.destinationCountry || '');
  const [currentStep, setCurrentStep] = useState(0);

  // Helper function to safely convert string dates to dayjs objects
  const convertToDayjs = useCallback((dateString) => {
    if (!dateString) return null;
    const date = dayjs(dateString);
    return date.isValid() ? date : null;
  }, []);

  // Process initial values on component mount
  useEffect(() => {
    if (initialValues) {
      const processedValues = {
        ...initialValues,
        inquiryDate: convertToDayjs(initialValues.inquiryDate),
        nextFollowUpDate: convertToDayjs(initialValues.nextFollowUpDate)
      };
      form.setFieldsValue(processedValues);
    }
  }, [initialValues, form, convertToDayjs]);

  const handleAddCustomField = useCallback(() => {
    if (!newField.name || !newField.label) {
      message.error('Field name and label are required');
      return;
    }

    // Check for duplicate field names
    if (customFields.some(field => field.name === newField.name)) {
      message.error('Field name must be unique');
      return;
    }

    setCustomFields(prevFields => [...prevFields, newField]);
    setIsModalVisible(false);
    setNewField({
      type: 'text',
      name: '',
      label: '',
      placeholder: '',
      required: false
    });
  }, [customFields, newField]);

  const handleRemoveCustomField = useCallback((fieldName) => {
    setCustomFields(prevFields => prevFields.filter(field => field.name !== fieldName));
    form.setFieldValue(fieldName, undefined);
  }, [form]);

  const validateRequiredFields = useCallback((values) => {
    const missingFields = [];
    Object.entries(REQUIRED_FIELDS).forEach(([field, label]) => {
      if (!values[field] || (Array.isArray(values[field]) && values[field].length === 0)) {
        missingFields.push(label);
      }
    });
    return missingFields;
  }, []);

  const handleSubmit = useCallback(async (values) => {
    try {
      setFormLoading(true);
      
      // Format dates for submission
      const formattedValues = {
        ...values,
        inquiryDate: values.inquiryDate ? values.inquiryDate.format('YYYY-MM-DD') : null,
        nextFollowUpDate: values.nextFollowUpDate ? values.nextFollowUpDate.format('YYYY-MM-DD') : null
      };
      
      await onSubmit(formattedValues);
      message.success(isEdit ? 'Lead updated successfully' : 'Lead created successfully');
      router.push('/dashboard/leads');
    } catch (error) {
      message.error('Failed to save lead');
    } finally {
      setFormLoading(false);
    }
  }, [isEdit, onSubmit, router]);

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

  const uploadProps = useMemo(() => ({
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  }), []);

  const getStatusColor = useCallback((status) => {
    const colors = {
      New: 'blue',
      Contacted: 'orange',
      Qualified: 'green',
      Lost: 'red',
    };
    return colors[status] || 'default';
  }, []);

  const handleFileUpload = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList);
  }, []);

  const showCustomFieldModal = useCallback((field = null) => {
    if (field) {
      setNewField({
        type: field.type || 'text',
        name: field.name || '',
        label: field.label || '',
        placeholder: field.placeholder || '',
        required: field.required || false
      });
    } else {
      setNewField({
        type: 'text',
        name: '',
        label: '',
        placeholder: '',
        required: false
      });
    }
    setIsModalVisible(true);
  }, []);

  const handleCustomFieldOk = useCallback(() => {
    if (!newField.name || !newField.label) {
      message.error('Field name and label are required');
      return;
    }

    // Check for duplicate field names
    if (customFields.some(field => 
      field.name === newField.name && (!newField.id || field.id !== newField.id)
    )) {
      message.error('Field name must be unique');
      return;
    }

    if (newField.id) {
      // Update existing custom field
      setCustomFields(prevFields => prevFields.map(field => 
        field.id === newField.id ? { ...field, ...newField } : field
      ));
    } else {
      // Add new custom field
      const newCustomField = {
        id: `cf${Date.now()}`,
        ...newField,
        value: '' // Initialize with empty value
      };
      setCustomFields(prevFields => [...prevFields, newCustomField]);
    }
    
    setIsModalVisible(false);
    message.success(`Custom field ${newField.id ? 'updated' : 'added'} successfully`);
  }, [customFields, newField]);

  const handleDeleteCustomField = useCallback((fieldId) => {
    setCustomFields(prevFields => prevFields.filter(field => field.id !== fieldId));
    message.success('Custom field deleted successfully');
  }, []);

  const handleDestinationCountryChange = useCallback((value) => {
    setDestinationCountry(value);
    form.setFieldsValue({ preferredImmigrationProgram: undefined });
  }, [form]);

  const nextStep = useCallback(() => {
    setCurrentStep(prevStep => prevStep + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prevStep => prevStep - 1);
  }, []);

  // Memoize the custom fields section to prevent unnecessary re-renders
  const customFieldsSection = useMemo(() => {
    return (
      <>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4}>Custom Fields</Title>
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={() => showCustomFieldModal()}
          >
            Add Custom Field
          </Button>
        </div>
        
        {customFields.length > 0 ? (
          <Row gutter={[16, 16]}>
            {customFields.map(field => (
              <Col span={12} key={field.id}>
                <Form.Item
                  name={field.name}
                  label={
                    <Space>
                      {field.label}
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteCustomField(field.id)}
                      />
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
      </>
    );
  }, [customFields, showCustomFieldModal, handleDeleteCustomField, renderCustomField]);

  // Memoize the custom field modal to prevent unnecessary re-renders
  const customFieldModal = useMemo(() => {
    return (
      <Modal
        title="Add Custom Field"
        open={isModalVisible}
        onOk={handleCustomFieldOk}
        onCancel={() => setIsModalVisible(false)}
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
              {FIELD_TYPES.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
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
  }, [isModalVisible, handleCustomFieldOk, newField]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start',
      minHeight: '100vh',
      padding: '24px'
    }}>
      <Card style={{ 
        maxWidth: '1200px', 
        width: '100%',
        margin: '0 auto'
      }}>
        <Title level={2} style={{ 
          marginBottom: '32px', 
          textAlign: 'center'
        }}>
          {isEdit ? 'Edit Lead' : isViewMode ? 'Review Lead' : 'New Lead Registration'}
        </Title>
        <Spin spinning={formLoading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues}
            disabled={isViewMode}
            style={{ maxWidth: '1000px', margin: '0 auto' }}
          >
            <Steps current={currentStep} style={{ marginBottom: '24px' }}>
              <Step title="Personal Info" />
              <Step title="Visa Details" />
              <Step title="Follow-up" />
              <Step title="Documents" />
            </Steps>

            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <>
                <Title level={4}>Personal Information</Title>
                <Row gutter={24}>
                  <Col span={12}>
                <Form.Item
                  name="fullName"
                  label="Full Name"
                      rules={[{ required: true, message: 'Please enter the full name' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Enter full legal name" />
                </Form.Item>
              </Col>
                  <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter the email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                      <Input prefix={<MailOutlined />} placeholder="Enter email address" />
                </Form.Item>
              </Col>
            </Row>

                <Row gutter={24}>
                  <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: 'Please enter the phone number' },
                    { pattern: /^\+?[1-9]\d{1,14}$/, message: 'Please enter a valid phone number' }
                  ]}
                >
                      <Input prefix={<PhoneOutlined />} placeholder="Enter phone number with country code" />
                </Form.Item>
              </Col>
                  <Col span={12}>
                <Form.Item
                  name="nationality"
                  label="Nationality"
                  rules={[{ required: true, message: 'Please select nationality' }]}
                >
                  <Select
                        showSearch
                    placeholder="Select nationality"
                    optionFilterProp="children"
                  >
                    {COUNTRIES.map(country => (
                          <Option key={country.value} value={country.value}>{country.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="currentLocation"
              label="Current Location"
            >
              <Select
                    showSearch
                placeholder="Select current location"
                optionFilterProp="children"
              >
                {COUNTRIES.map(country => (
                      <Option key={country.value} value={country.value}>{country.label}</Option>
                ))}
              </Select>
            </Form.Item>

                <Form.Item
                  name="consent"
                  valuePropName="checked"
                  rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Please accept the consent')) }]}
                >
                  <Checkbox>
                    I agree to be contacted regarding my visa inquiry and accept the privacy policy.
                  </Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={nextStep}>
                    Next
                  </Button>
                </Form.Item>
              </>
            )}

            {/* Step 2: Visa Details */}
            {currentStep === 1 && (
              <>
                <Title level={4}>Visa Details</Title>
                <Row gutter={24}>
                  <Col span={12}>
                <Form.Item
                  name="visaType"
                  label="Visa Type Interested In"
                      rules={[{ required: true, message: 'Please select at least one visa type' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select visa types"
                    optionFilterProp="children"
                  >
                    {VISA_TYPES.map(type => (
                          <Option key={type.value} value={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
                  <Col span={12}>
                <Form.Item
                  name="destinationCountry"
                  label="Destination Country"
                  rules={[{ required: true, message: 'Please select destination country' }]}
                >
                  <Select
                        showSearch
                    placeholder="Select destination country"
                    optionFilterProp="children"
                        onChange={handleDestinationCountryChange}
                  >
                    {COUNTRIES.map(country => (
                          <Option key={country.value} value={country.value}>{country.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

                <Form.Item
                  name="preferredImmigrationProgram"
                  label="Preferred Immigration Program"
                >
                  <Select
                    showSearch
                    placeholder="Select immigration program"
                    optionFilterProp="children"
                    disabled={!destinationCountry}
                  >
                    {destinationCountry && IMMIGRATION_PROGRAMS.map(program => (
                      <Option key={program.value} value={program.value}>{program.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Row gutter={24}>
                  <Col span={12}>
                <Form.Item
                  name="inquiryDate"
                  label="Inquiry Date"
                  rules={[{ required: true, message: 'Please select inquiry date' }]}
                >
                      <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
                  <Col span={12}>
                <Form.Item
                  name="leadSource"
                  label="Source of Lead"
                  rules={[{ required: true, message: 'Please select lead source' }]}
                >
                      <Select placeholder="Select lead source">
                    {LEAD_SOURCES.map(source => (
                          <Option key={source.value} value={source.value}>{source.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="additionalNotes"
              label="Additional Notes"
            >
                  <TextArea rows={4} placeholder="Enter any additional information" />
            </Form.Item>

                <Form.Item>
                  <Space>
                    <Button onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="primary" onClick={nextStep}>
                      Next
                    </Button>
                  </Space>
                </Form.Item>
              </>
            )}

            {/* Step 3: Follow-up Information */}
            {currentStep === 2 && (
              <>
                <Title level={4}>Follow-up Information</Title>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="status"
                      label="Lead Status"
                      rules={[{ required: true, message: 'Please select lead status' }]}
                    >
                      <Select placeholder="Select lead status">
                        {FOLLOW_UP_METHODS.map(status => (
                          <Option key={status.value} value={status.value}>{status.label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="assignedTo"
                      label="Assigned To"
                    >
                      <Select placeholder="Select staff member">
                        {/* Add staff member options here */}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="leadScore"
                      label="Lead Score"
                    >
                      <InputNumber style={{ width: '100%' }} min={0} max={100} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="leadStage"
                      label="Lead Stage"
                    >
                      <Select placeholder="Select lead stage">
                        {LEAD_STAGES.map(stage => (
                          <Option key={stage.value} value={stage.value}>{stage.label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="nextFollowUpDate"
                      label="Next Follow-up Date"
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="followUpMethod"
                      label="Follow-up Method"
                    >
                      <Select placeholder="Select follow-up method">
                        {FOLLOW_UP_METHODS.map(method => (
                          <Option key={method.value} value={method.value}>{method.label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Space>
                    <Button onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="primary" onClick={nextStep}>
                      Next
                    </Button>
                  </Space>
                </Form.Item>
              </>
            )}

            {/* Step 4: Documents and Custom Fields */}
            {currentStep === 3 && (
              <>
                <Title level={4}>Documents</Title>
            <Form.Item
                  name="passportCopy"
              label="Passport Copy"
                  extra="Upload passport copy (.pdf, .jpg)"
                >
                  <Upload
                    name="passportCopy"
                    fileList={fileList.filter(file => file.name.includes('passport'))}
                    onChange={handleFileUpload}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Upload Passport Copy</Button>
                  </Upload>
            </Form.Item>

            <Form.Item
              name="resume"
              label="Resume/CV"
                  extra="Upload resume/CV (.pdf, .docx)"
                >
                  <Upload
                    name="resume"
                    fileList={fileList.filter(file => file.name.includes('resume') || file.name.includes('cv'))}
                    onChange={handleFileUpload}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Upload Resume/CV</Button>
                  </Upload>
            </Form.Item>

            <Form.Item
                  name="otherDocs"
              label="Other Supporting Documents"
                  extra="Upload other documents (IELTS, ECA, etc.)"
                >
                  <Upload
                    name="otherDocs"
                    fileList={fileList.filter(file => !file.name.includes('passport') && !file.name.includes('resume') && !file.name.includes('cv'))}
                    onChange={handleFileUpload}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Upload Other Documents</Button>
                  </Upload>
            </Form.Item>

                <Divider />

            {/* Custom Fields Section */}
                {customFieldsSection}

                <Form.Item>
                  <Space>
                    <Button onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {isEdit ? 'Update Lead' : 'Create Lead'}
                    </Button>
                  </Space>
              </Form.Item>
              </>
            )}
          </Form>
        </Spin>

        {/* Add Custom Field Modal */}
        {customFieldModal}
      </Card>
    </div>
  );
};

export default LeadForm; 