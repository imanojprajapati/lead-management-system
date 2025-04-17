import "@/styles/globals.css";
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FormOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { LeadsProvider } from '../contexts/LeadsContext';

const { Header, Sider, Content } = Layout;

function DashboardLayout({ children, collapsed, setCollapsed, currentRoute }) {
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
  ];

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
        <Header style={{ padding: 0, background: '#fff' }}>
          <button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
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
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  
  // Check if the current route is a dashboard route
  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  
  // Get the current route segment for menu highlighting
  const currentRoute = router.pathname.split('/')[2] || 'dashboard';

  const content = isDashboardRoute ? (
    <DashboardLayout 
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      currentRoute={currentRoute}
    >
      <LeadsProvider>
        <Component {...pageProps} />
      </LeadsProvider>
    </DashboardLayout>
  ) : (
    <LeadsProvider>
      <Component {...pageProps} />
    </LeadsProvider>
  );

  return content;
}
