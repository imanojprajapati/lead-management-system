import React, { useState, useMemo, useCallback } from 'react';
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
  Tag,
  Select,
  Tabs,
  Drawer,
  Badge,
  Divider,
  DatePicker
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
  PieChartOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  HistoryOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useLeads } from '@/contexts/LeadsContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Line, Pie, Column } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Mock data for leads
const mockLeads = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8901',
    visaType: 'Student',
    nationality: 'India',
    inquiryDate: '2024-04-01',
    status: 'New',
    assignedStaff: 'Sarah Sales',
    followUpDate: '2024-04-15',
    notes: 'Interested in MBA program'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 8902',
    visaType: 'Work',
    nationality: 'China',
    inquiryDate: '2024-04-02',
    status: 'Contacted',
    assignedStaff: 'Mike Support',
    followUpDate: '2024-04-16',
    notes: 'Looking for tech job opportunities'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '+1 234 567 8903',
    visaType: 'Tourist',
    nationality: 'UK',
    inquiryDate: '2024-04-03',
    status: 'In Progress',
    assignedStaff: 'Sarah Sales',
    followUpDate: '2024-04-17',
    notes: 'Planning a 3-month visit'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1 234 567 8904',
    visaType: 'Student',
    nationality: 'Canada',
    inquiryDate: '2024-04-04',
    status: 'Followed Up',
    assignedStaff: 'Mike Support',
    followUpDate: '2024-04-18',
    notes: 'Applied for documents'
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael@example.com',
    phone: '+1 234 567 8905',
    visaType: 'Work',
    nationality: 'Australia',
    inquiryDate: '2024-04-05',
    status: 'Closed',
    assignedStaff: 'Sarah Sales',
    followUpDate: '2024-04-19',
    notes: 'Successfully processed'
  },
  {
    id: 6,
    name: 'Sophia Martinez',
    email: 'sophia@example.com',
    phone: '+1 234 567 8906',
    visaType: 'Student',
    nationality: 'Spain',
    inquiryDate: '2024-04-06',
    status: 'New',
    assignedStaff: 'Mike Support',
    followUpDate: '2024-04-20',
    notes: 'Interested in language courses'
  },
  {
    id: 7,
    name: 'David Anderson',
    email: 'david@example.com',
    phone: '+1 234 567 8907',
    visaType: 'Work',
    nationality: 'Germany',
    inquiryDate: '2024-04-07',
    status: 'Contacted',
    assignedStaff: 'Sarah Sales',
    followUpDate: '2024-04-21',
    notes: 'Looking for engineering positions'
  },
  {
    id: 8,
    name: 'Olivia Taylor',
    email: 'olivia@example.com',
    phone: '+1 234 567 8908',
    visaType: 'Tourist',
    nationality: 'France',
    inquiryDate: '2024-04-08',
    status: 'In Progress',
    assignedStaff: 'Mike Support',
    followUpDate: '2024-04-22',
    notes: 'Planning a 2-week vacation'
  },
  {
    id: 9,
    name: 'James Brown',
    email: 'james@example.com',
    phone: '+1 234 567 8909',
    visaType: 'Student',
    nationality: 'Brazil',
    inquiryDate: '2024-04-09',
    status: 'Followed Up',
    assignedStaff: 'Sarah Sales',
    followUpDate: '2024-04-23',
    notes: 'Submitted application'
  },
  {
    id: 10,
    name: 'Emma White',
    email: 'emma@example.com',
    phone: '+1 234 567 8910',
    visaType: 'Work',
    nationality: 'Japan',
    inquiryDate: '2024-04-10',
    status: 'Closed',
    assignedStaff: 'Mike Support',
    followUpDate: '2024-04-24',
    notes: 'Successfully processed'
  }
];

// Mock data for daily leads
const mockDailyLeads = Array.from({ length: 30 }, (_, i) => {
  const date = dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD');
  return {
    date,
    leads: Math.floor(Math.random() * 10) + 1,
    conversions: Math.floor(Math.random() * 5) + 1
  };
});

// Mock data for staff performance
const mockStaffPerformance = [
  {
    id: 1,
    name: 'Sarah Sales',
    leadsHandled: 45,
    conversionRate: 72,
    followUpSuccess: 85
  },
  {
    id: 2,
    name: 'Mike Support',
    leadsHandled: 38,
    conversionRate: 68,
    followUpSuccess: 82
  },
  {
    id: 3,
    name: 'John Admin',
    leadsHandled: 42,
    conversionRate: 75,
    followUpSuccess: 88
  }
];

// Status colors
const STATUS_COLORS = {
  'New': 'blue',
  'Contacted': 'orange',
  'In Progress': 'purple',
  'Followed Up': 'green',
  'Closed': 'red'
};

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [leads, setLeads] = useState(mockLeads);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter leads based on status and date range
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      let matchesDateRange = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const inquiryDate = dayjs(lead.inquiryDate);
        matchesDateRange = inquiryDate.isAfter(dateRange[0]) && 
                          inquiryDate.isBefore(dateRange[1]);
      }
      
      return matchesStatus && matchesDateRange;
    });
  }, [leads, statusFilter, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    
    const closed = byStatus['Closed'] || 0;
    const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    
    const followedUp = byStatus['Followed Up'] || 0;
    const followUpSuccessRate = followedUp > 0 ? Math.round((closed / followedUp) * 100) : 0;
    
    return {
      total,
      byStatus,
      conversionRate,
      followUpSuccessRate
    };
  }, [leads]);

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('all');
    setDateRange(null);
  };

  // View lead details
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setDrawerVisible(true);
  };

  // Edit lead status
  const handleEditStatus = (lead, newStatus) => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLeads(leads.map(l => 
        l.id === lead.id ? { ...l, status: newStatus } : l
      ));
      setLoading(false);
    }, 500);
  };

  // Follow up with lead
  const handleFollowUp = (lead) => {
    router.push(`/dashboard/leads/view/${lead.id}`);
  };

  // Close drawer
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedLead(null);
  };

  // Table columns
  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => handleViewLead(record)}>{text}</a>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Contact Info',
      key: 'contactInfo',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <MailOutlined style={{ color: '#1677ff' }} />
            <span>{record.email}</span>
          </Space>
          <Space>
            <PhoneOutlined style={{ color: '#1677ff' }} />
            <span>{record.phone}</span>
          </Space>
        </Space>
      )
    },
    {
      title: 'Visa Details',
      key: 'visaDetails',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <GlobalOutlined style={{ color: '#1677ff' }} />
            <span>{record.visaType}</span>
          </Space>
          <Space>
            <UserOutlined style={{ color: '#1677ff' }} />
            <span>{record.nationality}</span>
          </Space>
        </Space>
      )
    },
    {
      title: 'Inquiry Date',
      dataIndex: 'inquiryDate',
      key: 'inquiryDate',
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: '#1677ff' }} />
          <span>{dayjs(date).format('MMM D, YYYY')}</span>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.inquiryDate).unix() - dayjs(b.inquiryDate).unix()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={STATUS_COLORS[status]}>
          {status}
        </Tag>
      ),
      filters: Object.keys(STATUS_COLORS).map(status => ({
        text: status,
        value: status
      })),
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Assigned Staff',
      dataIndex: 'assignedStaff',
      key: 'assignedStaff',
      render: (staff) => (
        <Space>
          <TeamOutlined style={{ color: '#1677ff' }} />
          <span>{staff}</span>
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewLead(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Status">
            <Select
              defaultValue={record.status}
              style={{ width: 120 }}
              onChange={(value) => handleEditStatus(record, value)}
              loading={loading}
            >
              {Object.keys(STATUS_COLORS).map(status => (
                <Option key={status} value={status}>
                  <Tag color={STATUS_COLORS[status]}>{status}</Tag>
                </Option>
              ))}
            </Select>
          </Tooltip>
          <Tooltip title="Follow Up">
            <Button 
              type="link" 
              icon={<HistoryOutlined />} 
              onClick={() => handleFollowUp(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ], [loading]);

  // Pie chart data
  const pieData = useMemo(() => {
    return Object.entries(stats.byStatus).map(([status, value]) => ({
      type: status,
      value
    }));
  }, [stats.byStatus]);

  // Line chart data
  const lineData = useMemo(() => {
    return mockDailyLeads.map(item => ({
      date: item.date,
      value: item.leads,
      type: 'Leads'
    }));
  }, []);

  // Column chart data
  const columnData = useMemo(() => {
    return mockDailyLeads.map(item => ({
      date: item.date,
      leads: item.leads,
      conversions: item.conversions
    }));
  }, []);

  // Pie chart config
  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      formatter: (datum) => {
        if (!datum || typeof datum.value === 'undefined') {
          return '0%';
        }
        const percentage = Math.round((datum.value / stats.total) * 100);
        return `${percentage}%`;
      },
      style: {
        textAlign: 'center',
        fontSize: 14
      }
    },
    interactions: [
      {
        type: 'element-active'
      }
    ]
  };

  // Line chart config
  const lineConfig = {
    data: lineData,
    xField: 'date',
    yField: 'value',
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
  };

  // Column chart config
  const columnConfig = {
    data: columnData,
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    columnStyle: {
      radius: [20, 20, 0, 0]
    },
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' }
      ]
    }
  };

  // Staff performance columns
  const staffColumns = useMemo(() => [
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
  ], []);

  return (
    <ProtectedRoute>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={4} style={{ margin: 0 }}>Lead Dashboard</Title>
        </Card>

        {/* Analytics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Leads"
                value={stats.total}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Conversion Rate"
                value={stats.conversionRate}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: stats.conversionRate >= 50 ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Follow-up Success Rate"
                value={stats.followUpSuccessRate}
                suffix="%"
                prefix={<HistoryOutlined />}
                valueStyle={{ color: stats.followUpSuccessRate >= 70 ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Leads"
                value={stats.total - (stats.byStatus['Closed'] || 0)}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Lead Distribution by Status">
              <Pie {...pieConfig} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Daily Lead Trends">
              <Line {...lineConfig} />
            </Card>
          </Col>
        </Row>

        {/* Lead Pipeline */}
        <Card title="Lead Pipeline">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>New Leads</Text>
              <Progress 
                percent={Math.round(((stats.byStatus['New'] || 0) / stats.total) * 100)} 
                status="active"
                strokeColor="#1890ff"
              />
            </div>
            <div>
              <Text>Contacted</Text>
              <Progress 
                percent={Math.round(((stats.byStatus['Contacted'] || 0) / stats.total) * 100)} 
                status="active"
                strokeColor="#faad14"
              />
            </div>
            <div>
              <Text>In Progress</Text>
              <Progress 
                percent={Math.round(((stats.byStatus['In Progress'] || 0) / stats.total) * 100)} 
                status="active"
                strokeColor="#722ed1"
              />
            </div>
            <div>
              <Text>Followed Up</Text>
              <Progress 
                percent={Math.round(((stats.byStatus['Followed Up'] || 0) / stats.total) * 100)} 
                status="active"
                strokeColor="#52c41a"
              />
            </div>
            <div>
              <Text>Closed</Text>
              <Progress 
                percent={Math.round(((stats.byStatus['Closed'] || 0) / stats.total) * 100)} 
                status="success"
                strokeColor="#f5222d"
              />
            </div>
          </Space>
        </Card>

        {/* Staff Performance */}
        <Card title="Staff Performance">
          <Table 
            columns={staffColumns} 
            dataSource={mockStaffPerformance}
            rowKey="id"
            pagination={false}
          />
        </Card>

        {/* Lead Details Drawer */}
        <Drawer
          title="Lead Details"
          placement="right"
          onClose={handleCloseDrawer}
          open={drawerVisible}
          width={400}
        >
          {selectedLead && (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5}>Contact Information</Title>
                  <Space>
                    <UserOutlined />
                    <Text strong>{selectedLead.name}</Text>
                  </Space>
                  <Space>
                    <MailOutlined />
                    <Text>{selectedLead.email}</Text>
                  </Space>
                  <Space>
                    <PhoneOutlined />
                    <Text>{selectedLead.phone}</Text>
                  </Space>
                </Space>
              </Card>

              <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5}>Visa Information</Title>
                  <Space>
                    <GlobalOutlined />
                    <Text strong>Visa Type:</Text>
                    <Text>{selectedLead.visaType}</Text>
                  </Space>
                  <Space>
                    <UserOutlined />
                    <Text strong>Nationality:</Text>
                    <Text>{selectedLead.nationality}</Text>
                  </Space>
                </Space>
              </Card>

              <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5}>Status Information</Title>
                  <Space>
                    <CalendarOutlined />
                    <Text strong>Inquiry Date:</Text>
                    <Text>{dayjs(selectedLead.inquiryDate).format('MMM D, YYYY')}</Text>
                  </Space>
                  <Space>
                    <Tag color={STATUS_COLORS[selectedLead.status]}>
                      {selectedLead.status}
                    </Tag>
                  </Space>
                  <Space>
                    <TeamOutlined />
                    <Text strong>Assigned Staff:</Text>
                    <Text>{selectedLead.assignedStaff}</Text>
                  </Space>
                  <Space>
                    <HistoryOutlined />
                    <Text strong>Follow-up Date:</Text>
                    <Text>{dayjs(selectedLead.followUpDate).format('MMM D, YYYY')}</Text>
                  </Space>
                </Space>
              </Card>

              <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5}>Notes</Title>
                  <Text>{selectedLead.notes}</Text>
                </Space>
              </Card>

              <Divider />

              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseDrawer}>
                  Close
                </Button>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    handleCloseDrawer();
                    router.push(`/dashboard/leads/edit/${selectedLead.id}`);
                  }}
                >
                  Edit Lead
                </Button>
              </Space>
            </Space>
          )}
        </Drawer>
      </Space>
    </ProtectedRoute>
  );
};

export default DashboardPage; 