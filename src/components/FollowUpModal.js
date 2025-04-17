import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Button, 
  message,
  Space,
  Typography,
  Card,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  CalendarOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

// Configure dayjs plugins
dayjs.extend(relativeTime);
dayjs.locale('en');

const { TextArea } = Input;
const { Title, Text } = Typography;

const FOLLOW_UP_METHODS = [
  { value: 'call', label: 'Phone Call', icon: <PhoneOutlined />, color: '#1890ff' },
  { value: 'email', label: 'Email', icon: <MailOutlined />, color: '#52c41a' },
  { value: 'message', label: 'Message', icon: <MessageOutlined />, color: '#722ed1' },
  { value: 'meeting', label: 'Meeting', icon: <CalendarOutlined />, color: '#fa8c16' }
];

const FollowUpModal = ({ 
  visible, 
  onCancel, 
  onSave, 
  leadId, 
  leadName,
  staffMembers = []
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('call');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const followUpData = {
        ...values,
        date: values.date.toISOString(),
        leadId,
        leadName,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      await onSave(followUpData);
      message.success('Follow-up scheduled successfully');
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('Failed to schedule follow-up');
      console.error('Follow-up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>Schedule Follow-up</Title>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      bodyStyle={{ padding: '24px' }}
    >
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text type="secondary">Lead Information</Text>
          <Title level={5} style={{ margin: 0 }}>{leadName}</Title>
        </Space>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs(),
          method: 'call'
        }}
        onValuesChange={(changedValues) => {
          if (changedValues.method) {
            setSelectedMethod(changedValues.method);
          }
        }}
      >
        <Card 
          bordered={false} 
          style={{ 
            marginBottom: 24,
            backgroundColor: '#f5f5f5'
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>Communication Method</Title>
            <Form.Item
              name="method"
              rules={[{ required: true, message: 'Please select communication method' }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                style={{ width: '100%' }}
                dropdownStyle={{ width: '100%' }}
              >
                {FOLLOW_UP_METHODS.map(method => (
                  <Select.Option key={method.value} value={method.value}>
                    <Space>
                      <span style={{ color: method.color }}>{method.icon}</span>
                      {method.label}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
        </Card>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Follow-up Date & Time"
              rules={[{ required: true, message: 'Please select follow-up date and time' }]}
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                suffixIcon={<ClockCircleOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="assignedTo"
              label="Assigned To"
              rules={[{ required: true, message: 'Please select staff member' }]}
            >
              <Select
                style={{ width: '100%' }}
                suffixIcon={<UserOutlined />}
              >
                {staffMembers.map(staff => (
                  <Select.Option key={staff.id} value={staff.id}>
                    <Space>
                      <UserOutlined />
                      {staff.name}
                    </Space>
                  </Select.Option>
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
            placeholder="Enter details about the follow-up..."
            style={{ 
              resize: 'none',
              backgroundColor: '#fff'
            }}
          />
        </Form.Item>

        <Divider />

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={loading}
            icon={<CalendarOutlined />}
          >
            Schedule Follow-up
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default FollowUpModal; 