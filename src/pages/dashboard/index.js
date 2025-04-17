import React, { memo, useMemo } from 'react';
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

const DashboardPage = memo(() => {
  const router = useRouter();

  // Memoize statistics data to prevent unnecessary recalculations
  const statistics = useMemo(() => [
    {
      title: 'Total Leads',
      value: 150,
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Active Leads',
      value: 45,
      icon: <TeamOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Converted',
      value: 85,
      icon: <CheckCircleOutlined />,
      color: '#722ed1'
    },
    {
      title: 'Pending',
      value: 20,
      icon: <ClockCircleOutlined />,
      color: '#faad14'
    }
  ], []);

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
    <ProtectedRoute requiredPermission="dashboard">
      <div style={{ padding: '24px' }}>
        <Title level={2}>Dashboard</Title>
        
        <Row gutter={[16, 16]}>
          {statistics.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </Col>
          ))}
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
      </div>
    </ProtectedRoute>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage; 