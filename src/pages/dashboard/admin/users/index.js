import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Card, 
  Typography,
  message,
  Popconfirm,
  Tooltip
} from 'antd';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import UserFormModal from '@/components/admin/UserFormModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const { Title } = Typography;

// Mock data for users
const mockUsers = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-04-17T10:00:00Z'
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    role: 'sales',
    status: 'active',
    lastLogin: '2024-04-16T15:30:00Z'
  },
  {
    id: 3,
    fullName: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'support',
    status: 'inactive',
    lastLogin: '2024-04-15T09:15:00Z'
  }
];

const ROLE_COLORS = {
  admin: 'red',
  sales: 'blue',
  support: 'green'
};

const UserManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(users.filter(user => user.id !== userId));
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (values) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (selectedUser) {
        // Edit existing user
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...values }
            : user
        ));
        message.success('User updated successfully');
      } else {
        // Add new user
        const newUser = {
          id: Date.now(),
          ...values,
          lastLogin: null
        };
        setUsers([...users, newUser]);
        message.success('User added successfully');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={ROLE_COLORS[role]}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Sales', value: 'sales' },
        { text: 'Support', value: 'support' }
      ],
      onFilter: (value, record) => record.role === value
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? (
            <Space>
              <CheckCircleOutlined />
              Active
            </Space>
          ) : (
            <Space>
              <CloseCircleOutlined />
              Inactive
            </Space>
          )}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => date ? new Date(date).toLocaleString() : 'Never',
      sorter: (a, b) => {
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        return new Date(a.lastLogin) - new Date(b.lastLogin);
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit User">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              description="This action cannot be undone."
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ], []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <SettingOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={4} style={{ margin: 0 }}>Admin Panel</Title>
            </Space>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </div>
        </Card>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            total: users.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} users`
          }}
        />

        <UserFormModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          loading={loading}
        />
      </Space>
    </ProtectedRoute>
  );
};

export default UserManagementPage; 