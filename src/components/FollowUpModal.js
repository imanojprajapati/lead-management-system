import React from 'react';
import { 
  Modal, 
  Form, 
  DatePicker, 
  Select, 
  Input, 
  Button, 
  Space,
  Card,
  Typography,
  Row,
  Col,
  message
} from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  WhatsAppOutlined, 
  TeamOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const FOLLOW_UP_METHODS = [
  { value: 'phone', label: 'Phone', icon: <PhoneOutlined />, color: '#52c41a' },
  { value: 'email', label: 'Email', icon: <MailOutlined />, color: '#1890ff' },
  { value: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppOutlined />, color: '#25D366' },
  { value: 'meeting', label: 'Meeting', icon: <TeamOutlined />, color: '#722ed1' }
];

const FollowUpModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  loading = false,
  lead = null 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const followUpData = {
        ...values,
        dateTime: values.dateTime.format('YYYY-MM-DD HH:mm:ss'),
        leadId: lead?.id,
        leadName: lead?.fullName || lead?.name || 'Unknown Lead',
        status: 'pending'
      };
      onSubmit(followUpData);
      form.resetFields();
      message.success('Follow-up added successfully');
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please fill in all required fields');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  if (!visible) return null;

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>Add Follow-Up</Title>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      {lead && (
        <Card 
          style={{ marginBottom: 24, background: '#fafafa' }}
          bodyStyle={{ padding: '12px 24px' }}
        >
          <Space direction="vertical" size="small">
            <Text type="secondary">Lead Information</Text>
            <Space>
              <UserOutlined />
              <Text strong>{lead.fullName || lead.name || 'Unknown Lead'}</Text>
            </Space>
          </Space>
        </Card>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          dateTime: dayjs(),
          method: 'phone'
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dateTime"
              label="Follow-up Date & Time"
              rules={[{ required: true, message: 'Please select date and time' }]}
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                placeholder="Select date and time"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="method"
              label="Follow-up Method"
              rules={[{ required: true, message: 'Please select follow-up method' }]}
            >
              <Select placeholder="Select method">
                {FOLLOW_UP_METHODS.map(method => (
                  <Option key={method.value} value={method.value}>
                    <Space>
                      {method.icon}
                      {method.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Follow-up Notes"
          rules={[{ required: true, message: 'Please enter follow-up notes' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Enter detailed notes about the follow-up..."
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={loading}
            >
              Submit Follow-up
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FollowUpModal; 