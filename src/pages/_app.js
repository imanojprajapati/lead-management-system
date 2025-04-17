import "@/styles/globals.css";
import { useRouter } from 'next/router';
import { Layout, Menu, Button, Space, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FormOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  SettingOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { LeadsProvider } from '../contexts/LeadsContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const { Header, Sider, Content } = Layout;

// Separate the layout content into its own component
const LayoutContent = ({ children, collapsed, setCollapsed, currentRoute }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'lead-form',
      icon: <FormOutlined />,
      label: <Link href="/dashboard/lead-form">Lead Form</Link>,
    },
    {
      key: 'leads',
      icon: <TeamOutlined />,
      label: <Link href="/dashboard/leads">Leads</Link>,
    },
    ...(user?.role === 'admin' ? [{
      key: 'admin',
      icon: <AppstoreOutlined />,
      label: <Link href="/dashboard/admin/users">Admin Panel</Link>,
    }] : [])
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div 
          style={{ 
            height: 64,
            margin: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.06)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}
        >
          <h3 
            style={{ 
              margin: 0,
              color: '#1677ff',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {collapsed ? 'L' : 'LMS'}
          </h3>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentRoute]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>

          <Space>
            {user ? (
              <>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span>{user.name}</span>
                </Space>
                <Button 
                  type="text" 
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                type="primary" 
                icon={<LoginOutlined />}
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
            )}
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: '6px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

// Main App component
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  
  // Check if the current route is a dashboard route
  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  
  // Get the current route segment for menu highlighting
  const currentRoute = router.pathname.split('/')[2] || 'dashboard';

  return (
    <AuthProvider>
      <LeadsProvider>
        {isDashboardRoute ? (
          <LayoutContent 
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            currentRoute={currentRoute}
          >
            <Component {...pageProps} />
          </LayoutContent>
        ) : (
          <Component {...pageProps} />
        )}
      </LeadsProvider>
    </AuthProvider>
  );
}
