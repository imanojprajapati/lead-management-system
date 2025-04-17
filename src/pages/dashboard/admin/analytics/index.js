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
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Sample data - replace with API calls
const analyticsData = {
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
  ]
};

const AnalyticsDashboard = () => {
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

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <LineChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={4} style={{ margin: 0 }}>Analytics Dashboard</Title>
            </Space>
          </Space>
        </Card>

        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Leads"
                value={analyticsData.leadStats.total}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Conversion Rate"
                value={analyticsData.conversionRate}
                suffix="%"
                prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Follow-up Success"
                value={analyticsData.followUpSuccess}
                suffix="%"
                prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Leads"
                value={analyticsData.leadStats.inProgress}
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
                    percent={Math.round((analyticsData.leadStats.new / analyticsData.leadStats.total) * 100)} 
                    status="active"
                  />
                </div>
                <div>
                  <Text>Contacted</Text>
                  <Progress 
                    percent={Math.round((analyticsData.leadStats.contacted / analyticsData.leadStats.total) * 100)} 
                    status="active"
                  />
                </div>
                <div>
                  <Text>In Progress</Text>
                  <Progress 
                    percent={Math.round((analyticsData.leadStats.inProgress / analyticsData.leadStats.total) * 100)} 
                    status="active"
                  />
                </div>
                <div>
                  <Text>Followed Up</Text>
                  <Progress 
                    percent={Math.round((analyticsData.leadStats.followedUp / analyticsData.leadStats.total) * 100)} 
                    status="active"
                  />
                </div>
                <div>
                  <Text>Closed</Text>
                  <Progress 
                    percent={Math.round((analyticsData.leadStats.closed / analyticsData.leadStats.total) * 100)} 
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
                dataSource={analyticsData.staffPerformance}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default AnalyticsDashboard; 