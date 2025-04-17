import React, { useState, useCallback, memo } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

const LoginPage = memo(() => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(async (values) => {
    setLoading(true);
    try {
      const result = await login(values.username, values.password);
      if (result.success) {
        router.replace(result.redirectTo);
      }
    } finally {
      setLoading(false);
    }
  }, [login, router]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>Lead Management System</Title>
            <Title level={4}>Login</Title>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                size="large"
                autoComplete="username"
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
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary">
              Demo Credentials:<br />
              Admin: username: admin, password: admin<br />
              Staff: username: emp123, password: emp123
            </Typography.Text>
          </div>
        </Space>
      </Card>
    </div>
  );
});

LoginPage.displayName = 'LoginPage';

export default LoginPage; 