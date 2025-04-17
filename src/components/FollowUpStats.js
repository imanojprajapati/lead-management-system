import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  TeamOutlined,
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';

const FollowUpStats = ({ data }) => {
  // Sample data - replace with actual data
  const stats = {
    totalFollowUps: 150,
    completedFollowUps: 120,
    pendingFollowUps: 30,
    completionRate: 80,
    methodBreakdown: {
      phone: 45,
      email: 60,
      whatsapp: 30,
      meeting: 15
    },
    weeklyTrend: [
      { date: '2024-03-14', count: 25 },
      { date: '2024-03-15', count: 30 },
      { date: '2024-03-16', count: 28 },
      { date: '2024-03-17', count: 35 },
      { date: '2024-03-18', count: 32 },
      { date: '2024-03-19', count: 40 },
      { date: '2024-03-20', count: 38 }
    ]
  };

  const config = {
    data: stats.weeklyTrend,
    xField: 'date',
    yField: 'count',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Follow-ups"
              value={stats.totalFollowUps}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completedFollowUps}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pendingFollowUps}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={stats.completionRate}
              suffix="%"
              prefix={<Progress type="circle" percent={stats.completionRate} width={40} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Method Distribution">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Phone Calls"
                  value={stats.methodBreakdown.phone}
                  prefix={<PhoneOutlined style={{ color: '#52c41a' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Emails"
                  value={stats.methodBreakdown.email}
                  prefix={<MailOutlined style={{ color: '#1890ff' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="WhatsApp"
                  value={stats.methodBreakdown.whatsapp}
                  prefix={<WhatsAppOutlined style={{ color: '#25D366' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Meetings"
                  value={stats.methodBreakdown.meeting}
                  prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Weekly Trend">
            <Line {...config} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FollowUpStats; 