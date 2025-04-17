import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Progress, 
  Table,
  Space,
  Tooltip,
  Button,
  Tag
} from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title, Text } = Typography;

// Sample data - replace with API calls
const dashboardData = {
  leadStats: {
    total: 150,
    new: 45,
    contacted: 35,
    inProgress: 30,
    followedUp: 25,
    closed: 15
  },
  conversionRate: 65,
  followUpSuccess: 78,
  staffPerformance: [
    {
      id: '1',
      name: 'John Admin',
      leadsHandled: 45,
      conversionRate: 72,
      followUpSuccess: 85
    },
    {
      id: '2',
      name: 'Sarah Sales',
      leadsHandled: 38,
      conversionRate: 68,
      followUpSuccess: 82
    }
  ],
  recentLeads: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'new',
      date: '2024-03-20'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'contacted',
      date: '2024-03-19'
    }
  ]
};

const Dashboard = () => {
  const router = useRouter();

  const staffColumns = [
    {
      title: 'Staff Member',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
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
      render: (rate) => (
        <Space>
          <Progress 
            type="circle" 
            percent={rate} 
            width={40}
            format={percent => `${percent}%`}
          />
          <Text>{rate}%</Text>
        </Space>
      ),
      sorter: (a, b) => a.conversionRate - b.conversionRate
    },
    {
      title: 'Follow-up Success',
      dataIndex: 'followUpSuccess',
      key: 'followUpSuccess',
      render: (rate) => (
        <Space>
          <Progress 
            type="circle" 
            percent={rate} 
            width={40}
            format={percent => `${percent}%`}
          />
          <Text>{rate}%</Text>
        </Space>
      ),
      sorter: (a, b) => a.followUpSuccess - b.followUpSuccess
    }
  ];

  const recentLeadsColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          new: 'blue',
          contacted: 'orange',
          inProgress: 'purple',
          followedUp: 'green',
          closed: 'red'
        };
        return (
          <Tag color={colors[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => router.push(`/dashboard/leads/view/${record.id}`)}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <ProtectedRoute>
      <div style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                <LineChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={4} style={{ margin: 0 }}>Dashboard Overview</Title>
              </Space>
              <Space>
                <Button 
                  type="primary" 
                  icon={<BarChartOutlined />}
                  onClick={() => router.push('/dashboard/admin/analytics')}
                >
                  Full Analytics
                </Button>
              </Space>
            </Space>
          </Card>

          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Leads"
                  value={dashboardData.leadStats.total}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Conversion Rate"
                  value={dashboardData.conversionRate}
                  suffix="%"
                  prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Follow-up Success"
                  value={dashboardData.followUpSuccess}
                  suffix="%"
                  prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Active Leads"
                  value={dashboardData.leadStats.inProgress}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Lead Pipeline">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>New Leads</Text>
                    <Progress 
                      percent={Math.round((dashboardData.leadStats.new / dashboardData.leadStats.total) * 100)} 
                      status="active"
                    />
                  </div>
                  <div>
                    <Text>Contacted</Text>
                    <Progress 
                      percent={Math.round((dashboardData.leadStats.contacted / dashboardData.leadStats.total) * 100)} 
                      status="active"
                    />
                  </div>
                  <div>
                    <Text>In Progress</Text>
                    <Progress 
                      percent={Math.round((dashboardData.leadStats.inProgress / dashboardData.leadStats.total) * 100)} 
                      status="active"
                    />
                  </div>
                  <div>
                    <Text>Followed Up</Text>
                    <Progress 
                      percent={Math.round((dashboardData.leadStats.followedUp / dashboardData.leadStats.total) * 100)} 
                      status="active"
                    />
                  </div>
                  <div>
                    <Text>Closed</Text>
                    <Progress 
                      percent={Math.round((dashboardData.leadStats.closed / dashboardData.leadStats.total) * 100)} 
                      status="success"
                    />
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Staff Performance">
                <Table 
                  columns={staffColumns} 
                  dataSource={dashboardData.staffPerformance}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Recent Leads">
            <Table 
              columns={recentLeadsColumns} 
              dataSource={dashboardData.recentLeads}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Space>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard; 