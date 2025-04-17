import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  message,
  Space,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // For demo purposes, hardcoded admin credentials
      if (values.username === 'admin' && values.password === '1234') {
        const success = await login({
          id: '1',
          username: 'admin',
          role: 'admin',
          name: 'Admin User'
        });
        
        if (success) {
          message.success('Login successful');
          router.push('/dashboard');
        }
      } else {
        message.error('Invalid credentials');
      }
    } catch (error) {
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Please login to your account</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<LoginOutlined />}
                block
                size="large"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary">Demo Credentials</Text>
          </Divider>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>Username: admin</Text>
            <Text>Password: 1234</Text>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default Login; 