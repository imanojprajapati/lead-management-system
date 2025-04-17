import React from 'react';
import { Card, Typography, Row, Col, Button } from 'antd';
import { 
  TeamOutlined, 
  FormOutlined, 
  BarChartOutlined,
  ArrowRightOutlined 
} from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Title, Paragraph } = Typography;

const DashboardHome = () => {
  const router = useRouter();

  const features = [
    {
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#1677ff' }} />,
      title: 'Lead Management',
      description: 'Efficiently manage and track all your leads in one place'
    },
    {
      icon: <FormOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: 'Lead Capture',
      description: 'Capture new leads with our intuitive form system'
    },
    {
      icon: <BarChartOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      title: 'Analytics',
      description: 'Track your lead conversion rates and performance metrics'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Title level={1}>Welcome to LMS</Title>
              <Paragraph style={{ fontSize: '18px', marginBottom: '40px' }}>
                Your comprehensive Lead Management System for efficient lead tracking and conversion
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={() => router.push('/dashboard/leads')}
              >
                Get Started
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {features.map((feature, index) => (
          <Col xs={24} md={8} key={index}>
            <Card hoverable style={{ height: '100%', textAlign: 'center' }}>
              <div style={{ marginBottom: '20px' }}>
                {feature.icon}
              </div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardHome; 