import React, { memo, useMemo, useCallback, useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Popconfirm, 
  Space, 
  message, 
  Typography, 
  Tag,
  Card
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  MailOutlined,
  LockOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title } = Typography;
const { Option } = Select;

// Sample user data - replace with actual data in production
const SAMPLE_USERS = [
  {
    id: 1,
    name: 'John Admin',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-04-17 10:30:00'
  },
  {
    id: 2,
    name: 'Sarah Sales',
    email: 'sarah@example.com',
    role: 'sales',
    status: 'active',
    lastLogin: '2024-04-16 15:45:00'
  },
  {
    id: 3,
    name: 'Mike Support',
    email: 'mike@example.com',
    role: 'support',
    status: 'inactive',
    lastLogin: '2024-04-10 09:20:00'
  }
];

const UsersPage = memo(() => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Memoize columns configuration
  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleColors = {
          admin: 'red',
          sales: 'blue',
          support: 'green'
        };
        const roleLabels = {
          admin: 'Admin',
          sales: 'Sales',
          support: 'Support'
        };
        return <Tag color={roleColors[role]}>{roleLabels[role]}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (text) => text || 'Never'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      )
    }
  ], []);

  // Memoize sample data
  const data = useMemo(() => SAMPLE_USERS, []);

  const handleAdd = useCallback(() => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  }, [form]);

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalVisible(true);
  }, [form]);

  const handleDelete = useCallback((userId) => {
    try {
      const updatedUsers = SAMPLE_USERS.filter(user => user.id !== userId);
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
      console.error('Delete user error:', error);
    }
  }, []);

  const handleModalOk = useCallback(async (values) => {
    setLoading(true);
    try {
      if (editingUser) {
        // Update existing user
        const updatedUsers = SAMPLE_USERS.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        );
        message.success('User updated successfully');
      } else {
        // Add new user
        const newUser = {
          id: Date.now(),
          ...values,
          status: 'active',
          lastLogin: null
        };
        message.success('User added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error) {
      message.error('Failed to save user');
      console.error('Save user error:', error);
    } finally {
      setLoading(false);
    }
  }, [editingUser, form]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingUser(null);
  }, [form]);

  return (
    <ProtectedRoute requiredRole="admin">
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={2}>User Management</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Add User
            </Button>
          </div>

          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>

        <Modal
          title={editingUser ? 'Edit User' : 'Add User'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleModalOk}
            initialValues={{ role: 'sales' }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter the user name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter user name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter the email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter email address" />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter the password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
              </Form.Item>
            )}

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select prefix={<TeamOutlined />} placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="sales">Sales</Option>
                <Option value="support">Support</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={handleModalCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingUser ? 'Update' : 'Add'} User
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
});

UsersPage.displayName = 'UsersPage';

export default UsersPage; 