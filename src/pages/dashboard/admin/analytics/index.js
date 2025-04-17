import React, { useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Progress, 
  Table, 
  Space, 
  Avatar,
  Tag
} from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title, Text } = Typography;

// Sample data - replace with actual data in production
const SAMPLE_DATA = {
  leadStats: {
    total: 156,
    byStatus: {
      new: 25,
      contacted: 42,
      in_progress: 38,
      followed_up: 31,
      closed: 20
    },
    conversionRate: 12.8,
    followUpStats: {
      completed: 85,
      missed: 15,
      successRate: 85
    }
  },
  weeklyTrends: [
    { date: '2024-04-01', leads: 12, conversions: 2 },
    { date: '2024-04-08', leads: 18, conversions: 3 },
    { date: '2024-04-15', leads: 15, conversions: 4 },
    { date: '2024-04-22', leads: 22, conversions: 5 },
    { date: '2024-04-29', leads: 20, conversions: 6 }
  ],
  staffPerformance: [
    {
      id: 1,
      name: 'John Sales',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      leadsHandled: 45,
      conversionRate: 18.5,
      followUpRate: 92,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Sarah Support',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      leadsHandled: 38,
      conversionRate: 15.2,
      followUpRate: 88,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Mike Manager',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      leadsHandled: 42,
      conversionRate: 14.8,
      followUpRate: 85,
      trend: 'down'
    }
  ]
};

const AnalyticsDashboard = () => {
  // Line chart configuration
  const lineConfig = useMemo(() => ({
    data: SAMPLE_DATA.weeklyTrends,
    xField: 'date',
    yField: 'leads',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000
      }
    },
    point: {
      size: 5,
      shape: 'diamond'
    },
    tooltip: {
      showMarkers: false
    }
  }), []);

  // Staff performance columns
  const staffColumns = useMemo(() => [
    {
      title: 'Staff Member',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} />
          {text}
        </Space>
      )
    },
    {
      title: 'Leads Handled',
      dataIndex: 'leadsHandled',
      key: 'leadsHandled',
      sorter: (a, b) => a.leadsHandled - b.leadsHandled
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (rate) => `${rate}%`,
      sorter: (a, b) => a.conversionRate - b.conversionRate
    },
    {
      title: 'Follow-up Rate',
      dataIndex: 'followUpRate',
      key: 'followUpRate',
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small" 
          status={rate >= 90 ? 'success' : rate >= 80 ? 'normal' : 'exception'} 
        />
      ),
      sorter: (a, b) => a.followUpRate - b.followUpRate
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend) => (
        <Tag color={trend === 'up' ? 'green' : 'red'}>
          {trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {trend === 'up' ? 'Improving' : 'Declining'}
        </Tag>
      )
    }
  ], []);

  return (
    <ProtectedRoute requiredRole="admin">
      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ marginBottom: 24 }}>Analytics Dashboard</Title>

        {/* Key Metrics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Leads"
                value={SAMPLE_DATA.leadStats.total}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Conversion Rate"
                value={SAMPLE_DATA.leadStats.conversionRate}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: SAMPLE_DATA.leadStats.conversionRate >= 10 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Follow-up Success Rate"
                value={SAMPLE_DATA.leadStats.followUpStats.successRate}
                suffix="%"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: SAMPLE_DATA.leadStats.followUpStats.successRate >= 80 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Staff"
                value={SAMPLE_DATA.staffPerformance.length}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Lead Status Distribution */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <Card title="Lead Status Distribution">
              <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(SAMPLE_DATA.leadStats.byStatus).map(([status, count]) => (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                      <Text strong>{count}</Text>
                    </div>
                    <Progress 
                      percent={Math.round((count / SAMPLE_DATA.leadStats.total) * 100)} 
                      status={status === 'closed' ? 'success' : 'active'}
                      strokeColor={
                        status === 'new' ? '#1890ff' :
                        status === 'contacted' ? '#722ed1' :
                        status === 'in_progress' ? '#faad14' :
                        status === 'followed_up' ? '#13c2c2' :
                        '#52c41a'
                      }
                    />
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Weekly Lead Trends">
              <Line {...lineConfig} />
            </Card>
          </Col>
        </Row>

        {/* Staff Performance */}
        <Card title="Staff Performance" style={{ marginTop: 16 }}>
          <Table 
            columns={staffColumns} 
            dataSource={SAMPLE_DATA.staffPerformance} 
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AnalyticsDashboard; 