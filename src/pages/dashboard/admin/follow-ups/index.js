import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Space, 
  Button, 
  Tag, 
  Typography, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  Modal,
  message
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import FollowUpStats from '@/components/FollowUpStats';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const METHOD_ICONS = {
  phone: <PhoneOutlined style={{ color: '#52c41a' }} />,
  email: <MailOutlined style={{ color: '#1890ff' }} />,
  whatsapp: <WhatsAppOutlined style={{ color: '#25D366' }} />,
  meeting: <TeamOutlined style={{ color: '#722ed1' }} />
};

const STATUS_COLORS = {
  completed: 'success',
  pending: 'warning',
  cancelled: 'error'
};

const STATUS_ICONS = {
  completed: <CheckCircleOutlined />,
  pending: <ClockCircleOutlined />,
  cancelled: <ClockCircleOutlined />
};

// Sample data - replace with API calls
const initialFollowUps = [
  {
    id: '1',
    leadName: 'John Doe',
    leadId: '1',
    dateTime: '2024-03-20 10:00:00',
    method: 'phone',
    staffName: 'Sarah Sales',
    status: 'completed',
    notes: 'Discussed visa requirements and timeline.'
  },
  {
    id: '2',
    leadName: 'Jane Smith',
    leadId: '2',
    dateTime: '2024-03-19 15:30:00',
    method: 'email',
    staffName: 'John Admin',
    status: 'pending',
    notes: 'Sent follow-up email with document checklist.'
  }
];

const FollowUpsPage = () => {
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const handleStatusChange = (followUpId, newStatus) => {
    setFollowUps(prevFollowUps => 
      prevFollowUps.map(followUp => 
        followUp.id === followUpId 
          ? { ...followUp, status: newStatus }
          : followUp
      )
    );
    message.success('Status updated successfully');
  };

  const columns = [
    {
      title: 'Lead Name',
      dataIndex: 'leadName',
      key: 'leadName',
      render: (text, record) => (
        <Button type="link" onClick={() => window.location.href = `/dashboard/leads/view/${record.leadId}`}>
          {text}
        </Button>
      )
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      sorter: (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (method) => (
        <Space>
          {METHOD_ICONS[method]}
          {method.charAt(0).toUpperCase() + method.slice(1)}
        </Space>
      )
    },
    {
      title: 'Staff',
      dataIndex: 'staffName',
      key: 'staffName'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="pending">
            <Space>
              <ClockCircleOutlined />
              Pending
            </Space>
          </Option>
          <Option value="completed">
            <Space>
              <CheckCircleOutlined />
              Completed
            </Space>
          </Option>
        </Select>
      )
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    }
  ];

  const handleFilter = (values) => {
    setLoading(true);
    // Implement filtering logic here
    setLoading(false);
    setFilterVisible(false);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <FollowUpStats />
        
        <Card>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 0 }}>Follow-ups Management</Title>
            <Space>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => setFilterVisible(true)}
              >
                Filters
              </Button>
            </Space>
          </Space>
        </Card>

        <Table 
          columns={columns} 
          dataSource={followUps}
          rowKey="id"
          loading={loading}
        />

        <Modal
          title="Filter Follow-ups"
          open={filterVisible}
          onCancel={() => setFilterVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFilter}
          >
            <Form.Item name="dateRange" label="Date Range">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="method" label="Method">
              <Select allowClear placeholder="Select method">
                <Option value="phone">Phone</Option>
                <Option value="email">Email</Option>
                <Option value="whatsapp">WhatsApp</Option>
                <Option value="meeting">Meeting</Option>
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select allowClear placeholder="Select status">
                <Option value="pending">Pending</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>

            <Form.Item name="staff" label="Staff Member">
              <Select allowClear placeholder="Select staff member">
                <Option value="1">Sarah Sales</Option>
                <Option value="2">John Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setFilterVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Apply Filters
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </ProtectedRoute>
  );
};

export default FollowUpsPage; 